const express = require('express');
const { 
    CognitoIdentityProviderClient, 
    AdminGetUserCommand, 
    ListUsersCommand,
    AdminListGroupsForUserCommand,
    AdminCreateUserCommand,
    AdminAddUserToGroupCommand,
    AdminSetUserPasswordCommand,
    AdminUpdateUserAttributesCommand,
    AdminDeleteUserCommand,
    AdminRemoveUserFromGroupCommand
} = require('@aws-sdk/client-cognito-identity-provider');
const { S3Client, ListObjectsV2Command, ListBucketsCommand, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { LambdaClient, InvokeCommand } = require('@aws-sdk/client-lambda');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const path = require('path');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand, DeleteCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { restart } = require('nodemon');
const fs = require('fs');
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Security middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(compression());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// AWS Clients with retry configuration
const cognitoClient = new CognitoIdentityProviderClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
    maxAttempts: 3
});

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
    maxAttempts: 3
});

const dynamoDBClient = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    maxAttempts: 3,
});

const lambdaClient = new LambdaClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    maxAttempts: 3,
});

//DynamoDB Document Client for simplified operations
const docClient= DynamoDBDocumentClient.from(dynamoDBClient)

// Error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Internal Server Error',
            code: err.code || 'INTERNAL_ERROR'
        }
    });
};

// Request validation middleware
const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                error: {
                    message: error.details[0].message,
                    code: 'VALIDATION_ERROR'
                }
            });
        }
        next();
    };
};


// Cache for S3 bucket names
let bucketCache = null;
let lastBucketFetch = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Function to get user groups with caching
const getUserGroups = async (username) => {
    try {
        const params = {
            UserPoolId: process.env.USER_POOL_ID,
            Username: username
        };
        const command = new AdminListGroupsForUserCommand(params);
        const response = await cognitoClient.send(command);
        return response.Groups.map(group => group.GroupName);
    } catch (error) {
        console.error(`Error fetching groups for user ${username}:`, error);
        throw new Error('Failed to fetch user groups');
    }
};

// Function to list all available S3 buckets with caching
async function listBuckets() {
    try {
        const now = Date.now();
        if (bucketCache && (now - lastBucketFetch) < CACHE_DURATION) {
            return bucketCache;
        }

        const command = new ListBucketsCommand({});
        const response = await s3Client.send(command);
        bucketCache = response.Buckets;
        lastBucketFetch = now;
        return bucketCache;
    } catch (error) {
        console.error('Error listing buckets:', error);
        throw new Error('Failed to list S3 buckets');
    }
}

// Try to load verifyPassword schema, but don't fail if it's not found
let verifyPasswordSchema;
try {
    verifyPasswordSchema = require('./schemas/verifyPassword');
} catch (error) {
    console.warn('Warning: verifyPassword schema not found. Password verification will be disabled.');
}

let { InvoiceFormSchema, JSAFormSchema, CapillaryFormSchema } = {};
try {
    const dynamoDBSchemas = require('./schemas/dynamoDB');
    InvoiceFormSchema = dynamoDBSchemas.InvoiceFormSchema;
    JSAFormSchema = dynamoDBSchemas.JSAFormSchema;
    CapillaryFormSchema = dynamoDBSchemas.CapillaryFormSchema;
} catch (error) {
    console.log("Error loading dynamoDBSchemas. Check: server.js or schemas/dynamoDB.js in Backend: ", error);
    console.warn("DynamoDB schemas will not be available.");
}

// API Routes with improved error handling
app.post('/api/users/verify-temp-password', 
    verifyPasswordSchema ? validateRequest(verifyPasswordSchema) : (req, res, next) => next(),
    async (req, res, next) => {
        try {
            const { email } = req.body;
            const params = {
                UserPoolId: process.env.USER_POOL_ID,
                Username: email
            };

            const command = new AdminGetUserCommand(params);
            const response = await cognitoClient.send(command);

            res.status(200).json({ 
                exists: true, 
                needsNewPassword: response.UserStatus === 'FORCE_CHANGE_PASSWORD',
                email: email 
            });
        } catch (error) {
            if (error.name === 'UserNotFoundException') {
                res.status(404).json({ exists: false });
            } else {
                next(error);
            }
        }
    }
);


// Get all templates from S3
app.get('/api/templates', async (req, res) => {
    try {
        // First, list all available buckets
        const buckets = await listBuckets();
        
        // Find the correct bucket for templates
        const templateBucket = buckets.find(bucket => 
            bucket.Name.includes('vipinvoices') && bucket.Name.includes('templates')
        );

        if (!templateBucket) {
            throw new Error('Template bucket not found');
        }

        console.log('Using bucket:', templateBucket.Name);

        const params = {
            Bucket: templateBucket.Name,
            Prefix: '' // Remove the prefix to see all objects
        };

        const command = new ListObjectsV2Command(params);
        const response = await s3Client.send(command);

        console.log('S3 Response:', JSON.stringify(response, null, 2));

        // Check if there are any contents
        if (!response.Contents || response.Contents.length === 0) {
            console.log('No objects found in bucket');
            return res.status(200).json({ templates: [] });
        }

        // Transform the S3 objects into template data
        const templates = response.Contents
            .filter(item => item.Key !== '') // Filter out empty keys
            .map(item => {
                // Extract template name from the key
                const name = item.Key.split('/').pop().replace(/\.[^/.]+$/, '');
                // Create a URL for the template
                const url = `https://${templateBucket.Name}.s3.${process.env.AWS_REGION}.amazonaws.com/${item.Key}`;
                
                return {
                    id: item.ETag,
                    name: name,
                    url: url,
                    lastModified: item.LastModified,
                    size: item.Size
                };
            });

        console.log('Processed templates:', templates);
        res.status(200).json({ templates });
    } catch (error) {
        console.error('Error fetching templates:', error);
        res.status(500).json({ error: error.message });
    }
});

//Get all pricing plans from S3
app.get('/api/pricingplans', async (req, res) => {
    try {
        // List all buckets available
        const buckets = await listBuckets();

        // Find the correct bucket for pricing plans
        const pricingPlanBucket = buckets.find(bucket =>
            bucket.Name.includes('pricing') && bucket.Name.includes('plans')
        );

        if (!pricingPlanBucket) {
            console.error('Pricing Plans bucket not found');
            return res.status(404).json({ error: 'Pricing Plans bucket not found' });
        }

        console.log('Using bucket:', pricingPlanBucket.Name);

        const params = {
            Bucket: pricingPlanBucket.Name,
            Prefix: '' // Remove the prefix to see all objects
        };

        const command = new ListObjectsV2Command(params);
        const response = await s3Client.send(command);

        console.log('S3 Response:', JSON.stringify(response, null, 2));

        // Check if there are any contents
        if (!response.Contents || response.Contents.length === 0) {
            console.log('No objects found in bucket');
            return res.status(200).json({ pricingPlans: [] });
        }

        // Transform the S3 objects into pricing plan data
        const pricingPlans = response.Contents
            .filter(item => item.Key !== '') // Filter out empty keys
            .map(item => {
                // Extract plan name from the key
                const name = item.Key.split('/').pop().replace(/\.[^/.]+$/, '');
                // Create a URL for the plan
                const url = `https://${pricingPlanBucket.Name}.s3.${process.env.AWS_REGION}.amazonaws.com/${item.Key}`;
                
                return {
                    id: item.ETag,
                    name: name,
                    url: url,
                    lastModified: item.LastModified,
                    size: item.Size
                };
            });

        console.log('Processed Pricing Plans:', pricingPlans);
        res.status(200).json({ pricingPlans });
    } catch (error) {
        console.error('Error fetching pricing plans:', error);
        res.status(500).json({ error: error.message });
    }
});

//** COGNITO */

// Get all users from Cognito
app.get('/api/users', async (req, res) => {
    try {
        const params = {
            UserPoolId: 'us-east-1_Sk6JKaM2w',
            Limit: 60
        };

        const command = new ListUsersCommand(params);
        const response = await cognitoClient.send(command);

        // Transform the users data to include only necessary information
        const usersPromises = response.Users.map(async user => {
            const attributes = {};
            user.Attributes.forEach(attr => {
                attributes[attr.Name] = attr.Value;
            });

            // Get user groups
            const groups = await getUserGroups(user.Username);
            
            console.log('UserName: ', user.Username);    
            console.log('Name: ', attributes.name);
            console.log("Email: ", attributes.email);
            console.log("Groups: ", groups);

            return {
                username: user.Username,
                name: attributes.name || attributes.email,
                email: attributes.email,
                groups: groups,
                status: user.UserStatus,
                enabled: user.Enabled,
                createdAt: user.UserCreateDate,
                lastModified: user.UserLastModifiedDate
            };
        });

        // Wait for all user data to be processed
        const users = await Promise.all(usersPromises);
        res.status(200).json({ users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Create a new user in Cognito
app.post('/api/users/create', async (req, res) => {
    try {
        const { email, name, role } = req.body;

        // Validate input
        if (!email || !name || !role) {
            return res.status(400).json({ 
                error: 'Missing required fields: email, name, and role are required' 
            });
        }

        // Generate a temporary password
        const temporaryPassword = Math.random().toString(36).slice(-8) + 'Aa1!'; // Random password that meets requirements

        // Create user in Cognito with email verification enabled
        const createUserParams = {
            UserPoolId: 'us-east-1_Sk6JKaM2w',
            Username: email,
            TemporaryPassword: temporaryPassword,
            UserAttributes: [
                {
                    Name: 'email',
                    Value: email
                },
                {
                    Name: 'name',
                    Value: name
                },
                {
                    Name: 'email_verified',
                    Value: 'false' // Set to false to trigger verification
                }
            ],
            DesiredDeliveryMediums: ['EMAIL'],
            ForceAliasCreation: false
        };

        console.log('Creating user with params:', {
            ...createUserParams,
            TemporaryPassword: '[HIDDEN]'
        });

        const createUserCommand = new AdminCreateUserCommand(createUserParams);
        await cognitoClient.send(createUserCommand);

        // Add user to specified group
        const addToGroupParams = {
            UserPoolId: process.env.USER_POOL_ID,
            Username: email,
            GroupName: role
        };

        const addToGroupCommand = new AdminAddUserToGroupCommand(addToGroupParams);
        await cognitoClient.send(addToGroupCommand);

        res.status(201).json({
            success: true,
            message: 'User created successfully. Invitation email has been sent.',
            data: {
                email,
                name,
                role
            }
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ 
            error: error.message || 'Failed to create user' 
        });
    }
});

// Update a user's information (Name, Role, Email)
app.put('/api/users/update', async (req, res) => {
    try {
        console.log('Update user request received:', req.body);
        const { currentEmail, newEmail, newName, newRole } = req.body;

        if (!currentEmail) {
            return res.status(400).json({
                error: 'Current email is required'
            });
        }

        // Update user attributes if provided
        if (newName || newEmail) {
            const updateAttributesParams = {
                UserPoolId: process.env.USER_POOL_ID || 'us-east-1_Sk6JKaM2w',
                Username: currentEmail,
                UserAttributes: []
            };

            if (newName) {
                updateAttributesParams.UserAttributes.push({
                    Name: 'name',
                    Value: newName
                });
            }

            if (newEmail) {
                updateAttributesParams.UserAttributes.push({
                    Name: 'email',
                    Value: newEmail
                });
                // Also update email_verified attribute
                updateAttributesParams.UserAttributes.push({
                    Name: 'email_verified',
                    Value: 'true'
                });
            }

            console.log('Updating user attributes:', updateAttributesParams);
            const updateAttributesCommand = new AdminUpdateUserAttributesCommand(updateAttributesParams);
            await cognitoClient.send(updateAttributesCommand);
        }

        // Update user's role if provided
        if (newRole) {
            // First, get current groups
            const listGroupsParams = {
                UserPoolId: process.env.USER_POOL_ID || 'us-east-1_Sk6JKaM2w',
                Username: currentEmail
            };
            const listGroupsCommand = new AdminListGroupsForUserCommand(listGroupsParams);
            const currentGroups = await cognitoClient.send(listGroupsCommand);

            // Remove from all current groups
            for (const group of currentGroups.Groups) {
                const removeFromGroupParams = {
                    UserPoolId: process.env.USER_POOL_ID || 'us-east-1_Sk6JKaM2w',
                    Username: currentEmail,
                    GroupName: group.GroupName
                };
                const removeFromGroupCommand = new AdminRemoveUserFromGroupCommand(removeFromGroupParams);
                await cognitoClient.send(removeFromGroupCommand);
            }

            // Add to new group
            const addToGroupParams = {
                UserPoolId: process.env.USER_POOL_ID || 'us-east-1_Sk6JKaM2w',
                Username: currentEmail,
                GroupName: newRole
            };
            const addToGroupCommand = new AdminAddUserToGroupCommand(addToGroupParams);
            await cognitoClient.send(addToGroupCommand);
        }

        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: {
                email: newEmail || currentEmail,
                name: newName,
                role: newRole
            }
        });

    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({
            error: error.message || 'Failed to update user'
        });
    }
});

// Delete a user from Cognito
app.delete('/api/users/delete', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                error: 'Email is required'
            });
        }

        const params = {
            UserPoolId: process.env.USER_POOL_ID,
            Username: email
        };

        const command = new AdminDeleteUserCommand(params);
        await cognitoClient.send(command);

        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
            data: { email }
        });

    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({
            error: error.message || 'Failed to delete user'
        });
    }
});

//** INVOICE FORMS */

// Invoke Lambda Function to generate Work Ticket ID
app.get('/api/lambda/generateWorkTicketID-Invoices', async (req, res, next) => {
    try{
        console.log('Generating Work Ticket ID Invoices - Request received');
        
        const params = {
            FunctionName: 'GenerateWorkTicketID-Invoices',
            InvocationType: 'RequestResponse',
        };

        console.log('Invoking Lambda function with params:', params);
        
        const command = new InvokeCommand(params);
        const response = await lambdaClient.send(command);
        
        console.log('Lambda response received:', response);

        // Parse the Lambda response
        const payload = JSON.parse(Buffer.from(response.Payload).toString());
        console.log('Parsed payload:', payload);

        // Parse the body if it's a string
        const body = typeof payload.body === 'string' ? JSON.parse(payload.body) : payload.body;
        console.log('Parsed body:', body);

        if (response.FunctionError || payload.statusCode === 500) {
            throw new Error(body.error || 'Failed to invoke Lambda function');
        }

        // Ensure we're sending a properly formatted response
        res.status(200).json({
            success: true,
            workTicketID: body.workTicketID,
            message: 'Work Ticket ID generated successfully'
        });
    } catch (error) {
        console.error('Error invoking Lambda function-Invoices (server.js): ', error);
        // Send a properly formatted error response
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Failed to generate Work Ticket ID for Invoices'
        });
    }               
});

// Create a new Invoice Form in dynamoDB
app.post('/api/dynamoDB/createInvoiceForm', validateRequest(InvoiceFormSchema), async (req, res, next) => {
    try {
        const params = {
            TableName: 'InvoiceForm-ghr672m57fd2re7tckfmfby2e4-dev',
            Item: {
                // Required fields
                WorkTicketID: req.body.WorkTicketID,
                InvoiceDate: req.body.InvoiceDate,
                
                // Optional fields with defaults
                Spooler: req.body.Spooler || '',
                WorkType: req.body.WorkType || '',
                CableCompany: req.body.CableCompany || '',
                CableCompanyLocation: req.body.CableCompanyLocation || '',
                OilCompany: req.body.OilCompany || '',
                WellNumber: Number(req.body.WellNumber) || 0,
                WellNumberName: req.body.WellNumberName || '',
                LaborCosts: req.body.LaborCosts || [],
                JobType: req.body.JobType || [],
                Consumables: req.body.Consumables || [],
                Notes: req.body.Notes || '',
                CableLength: Number(req.body.CableLength) || 0,
                CableType: req.body.CableType || '',
                ReelNumber: req.body.ReelNumber || '',
                ExtraCharges: Number(req.body.ExtraCharges) || 0,
                InvoiceTotal: Number(req.body.InvoiceTotal) || 0,
                CustomerSignature: req.body.CustomerSignature || '',

                // Metadata fields
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                _lastChangedAt: new Date().toISOString(),
                _version: 1,
                _typename: 'Invoice Form'
            }
        };

        await docClient.send(new PutCommand(params));
        res.status(201).json({ 
            success: true, 
            message: 'Invoice form created successfully',
            data: params.Item
        });
    } catch (error) {
        console.error("Error creating invoice form:", error);
        next({
            status: 500,
            message: 'Failed to create invoice form',
            code: 'DB_ERROR',
            error: error.message
        });
    }
});

// Get an Invoice Form by ID
app.get('/api/dynamoDB/getAnInvoiceForm', async (req, res, next) => {
    try{
        const { WorkTickedID } = req.params;
        const params = {
            TableName: 'InvoiceForm-ghr672m57fd2re7tckfmfby2e4-dev',
            Key: { WorkTicketID }
        };
        const { InvoiceForm } = await docClient.send(new GetCommand(params));
        if (!InvoiceForm) {
            return res.status(404).json({ error: 'Invoice Form not found' });
        }
        res.status(200).json(InvoiceForm);
    } catch (error) {
        console.log("Error getting Invoice Form, check server.js (getAnInvoiceForm): ", error)
        next(error);
    }
});

// Get all items from InvoiceForm Table
app.get('/api/dynamoDB/getAllInvoiceForms', async (req, res, next) => {
    try {
        const { userName, userRole } = req.query;
        
        const { Items } = await docClient.send(new ScanCommand({
            TableName: 'InvoiceForm-ghr672m57fd2re7tckfmfby2e4-dev',
        }));

        if (!Items) {
            return res.status(404).json({
                error: {
                    message: 'No invoice forms found',
                    code: 'NOT_FOUND'
                }
            });
        }

        let filteredItems = Items;
        if (userRole === 'Operator') {
            filteredItems = Items.filter(item => item.Spooler === userName);
        }

        res.status(200).json({
            success: true,
            count: filteredItems.length,
            data: filteredItems
        });
    } catch (error) {
        console.error("Error getting all Invoice Forms:", error);
        next({
            status: 500,
            message: 'Failed to retrieve invoice forms',
            code: 'DB_ERROR',
            error: error.message
        });
    }
});

// Update an Invoice Form by ID
app.put('/api/dynamoDB/updateInvoiceForm/:WorkTicketID', validateRequest(InvoiceFormSchema), async (req, res, next) => {
    try{
        const { WorkTicketID } = req.params;
        const { data } = req.body;
        const params = {
            TableName: 'InvoiceForm-ghr672m57fd2re7tckfmfby2e4-dev',
            Key: { WorkTicketID },
            UpdateExpression: 'SET #data = :data, updatedAt = :updatedAt',
            ExpressionAttributeNames: { '#data': 'data' },
            ExpressionAttributeValues: {
                ':data': data,
                ':updatedAt': new Date().toISOString()
            } ,
            ReturnValues: 'ALL_NEW'
        };
        const { Attributes } = await docClient.send(new UpdateCommand(params));
        res.status(200).json(Attributes);
    }catch (error) {
        console.log("Error updating Invoice Form, check server.js (updateInvoiceForm): ", error)
        next(error);
    }
});

// Delete an Invoice Form by ID
app.delete('/api/dynamoDB/deleteInvoiceForm/:WorkTicketID', async (req, res, next) => {
    try{
        const { WorkTicketID } = req.params;
        const params = {
            TableName: 'InvoiceForm-ghr672m57fd2re7tckfmfby2e4-dev',
            Key: { WorkTicketID }
        };

        await docClient.send(new DeleteCommand(params));
        res.status(200).json({ message: 'Invoice Form deleted successfully' });
    } catch (error) {
        console.log("Error deleting Invoice Form, check server.js (deleteInvoiceForm): ", error)
        next(error);
    }
});

//** JSA FORMS */

//Invoke Lambda Function to generate Work Ticket ID
app.get('/api/lambda/generateWorkTicketID-Jsa', async (req, res, next) => {
    try{
        console.log('Generating Work Ticket ID  Jsa - Request received');

        const params = {
            FunctionName: 'GenerateWorkTicketID-Jsa',
            InvocationType: 'RequestResponse',
        };

        console.log('Invoking Lambda function with params:', params);

        const command = new InvokeCommand(params);
        const response = await lambdaClient.send(command);

        console.log('Lambda response received:', response);

        //Parse the Lambda response
        const payload = JSON.parse(Buffer.from(response.Payload).toString());
        console.log('Parsed payload:', payload);

        //Parse the body if it's a string
        const body = typeof payload.body === 'string' ? JSON.parse(payload.body): payload.body;
        console.log('Parsed body:', body);

        if (response.FunctionError || payload.statusCode === 500) {
            throw new Error(body.error || 'Failed to invoke Lambda function');
        }

        //Ensure we're sending a properly formatted response
        res.status(200).json({
            success: true.valueOf,
            workTicketID: body.workTicketID,
            message: 'Work Ticket ID generated successfully'
        });
    } catch(error) {
        console.error('Error invoking Lambda function-Jsa (server.js): ', error);
        //Send a properly formatted error response
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Failed to generate Work Ticket ID for Jsa'
        });
    }
});

//Get all items from JSAForm Table 
app.get('/api/dynamoDB/getAllJSAForms', async (req, res, next) => {
    try {
        const { userName, userRole } = req.query;

        const { Items } = await docClient.send(new ScanCommand({
            TableName: 'JsaForm-ghr672m57fd2re7tckfmfby2e4-dev',
        }));

        if (!Items) {
            return res.status(404).json({
                error: {
                    message: 'No JSA forms found',
                    code: 'NOT_FOUND'
                }
            });
        }

        let filteredItems = Items;
        if (userRole === 'Operator') {
            filteredItems = Items.filter(item => item.CreatedBy === userName);
        }

        res.status(200).json({
            success: true,
            count: filteredItems.length,
            data: filteredItems
        });
    } catch (error) {
        console.error("Error getting all JSA forms: ", error);
        next({
            status: 500,
            message: 'Failed to retrieve JSA forms',
            code: 'DB_ERROR',   
            error: error.message
        });
    }
});

app.post('/api/dynamoDB/createJSAForm', validateRequest(JSAFormSchema), async (req, res, next) => {
    try{
        const params={
            TableName: 'JsaForm-ghr672m57fd2re7tckfmfby2e4-dev',
            Item:{
                WorkTicketID: req.body.WorkTicketID,
                CustomerName: req.body.CustomerName,
                createdAt: new Date().toISOString(),
                EffectiveDate: req.body.EffectiveDate,
                FormDate: req.body.FormDate,
                Location: req.body.Location,
                Steps: req.body.Steps,
                Personnel: req.body.Personnel,
                updatedAt: new Date().toISOString(),
                _lastChangedAt: new Date().toISOString(),
                _version: 1,
                _typename: 'JSA Form'
            }
        };
        await docClient.send(new PutCommand(params));
        res.status(201).json({
            success: true,
            message: 'Jsa form created successfully',
            data: params.Item
        });
    } catch (error) {
        console.error("Error creating Jsa form:", error);
        next({
            status: 500,
            message: 'Failed to create Jsa form',
            code: 'DB_ERROR',
            error: error.message
        });
    }
});

//** CAPILLARY FORMS */

//Get all items from CapillaryForm Table
app.get('/api/dynamoDB/getAllCapillaryForms', async (req, res, next) => {
    try{
        const { userName, userRole } = req.query;

        const { Items } = await docClient.send(new ScanCommand({
            TableName: 'CapillaryForm-ghr672m57fd2re7tckfmfby2e4-dev',
        }));

        if (!Items) {
            return res.status(404).json({
                error: {
                    message: 'No capillary forms found',
                    code: 'NOT_FOUND'
                }
            });
        }

        let filteredItems = Items;
        if (userRole === 'Operator') {
            filteredItems = Items.filter(item => item.TechnicianName === userName);
        }

        res.status(200).json({
            success: true,
            count: filteredItems.length,
            data: filteredItems
        });
    } catch (error) {
        console.error("Error getting all Capillary Forms:", error);
        next({
            status: 500,
            message: 'Failed to retrieve capillary forms',
            code: 'DB_ERROR',
            error: error.message
        });
    }
});

app.post('/api/dynamoDB/createCapillaryForm', validateRequest(CapillaryFormSchema), async (req, res, next) => {
    try{
        const params = {
            TableName: 'CapillaryForm-ghr672m57fd2re7tckfmfby2e4-dev',
            Item:{
                WorkTicketID: req.body.WorkTicketID,
                Date: req.body.Date,
                Customer: req.body.Customer,
                WellName: req.body.WellName,
                TypeOfJob: req.body.TypeOfJob,
                VisualConfirmation: req.body.VisualConfirmation,
                IntervalPumping: req.body.IntervalPumping,
                PressureWhilePumping: req.body.PressureWhilePumping,
                PressureBleed: req.body.PressureBleed,
                CapillaryFlush: req.body.CapillaryFlush,
                ManifoldStatus: req.body.ManifoldStatus,
                LineTest: req.body.LineTest,
                CapillarySize: req.body.CapillarySize,
                Metallurgy: req.body.Metallurgy,
                Length: req.body.Length,
                FluidPumped: req.body.FluidPumped,
                TotalGallons: req.body.TotalGallons,
                Notes: req.body.Notes,
                Files: req.body.Files,
                FinalProductFile: req.body.FinalProductFile,
                TechnicianName: req.body.TechnicianName,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                _lastChangedAt: new Date().toISOString(),
                _version: 2,
                _typename: 'Capillary Form'
            }
        };
        await docClient.send(new PutCommand(params));
        res.status(201).json({
            success: true,
            message: 'Capillary form created successfully',
            data: params.Item
        });
    } catch (error) {
        console.error("Error creating capillary form:", error);
        next({
            status: 500,
            message: 'Failed to create capillary form',
            code: 'DB_ERROR',
            error: error.message
        });
    }
});


//**EMAIL JS */

// Send Request Template 
app.post('/api/email/sendRequestTemplate', async(req, res) => {
    try {
        const { 
            to_name,
            to_email,
            from_name,
            formType,
            formSpecs,
            reply_to
        } = req.body;

        // Validate required fields
        if (!to_email || !formSpecs || !formType) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: email, form specifications, and form type are required'
            });
        }

        // EmailJS configuration
        const data = {
            service_id: 'service_fh19mmh',
            template_id: 'template_t4svwgf',
            user_id: 'OThiis90G_SdAJ8IL',
            template_params: {
                to_name: to_name || 'User',
                to_email,
                from_name: from_name || 'Custom GoFormz',
                formType: formType.trim(),
                formSpecs: formSpecs.trim(),
                reply_to: reply_to || 'support@customgoformz.com'
            },
            accessToken: '32yu7e_eH7uEy4xshsRQZ'
        };

        console.log('Sending email with data:', {
            ...data,
            accessToken: '[HIDDEN]',
            template_params: {
                ...data.template_params,
                formSpecs: formSpecs.length > 100 ? formSpecs.substring(0, 100) + '...' : formSpecs, // Log truncated specs
                formType
            }
        });

        // Make request to EmailJS API
        const emailResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!emailResponse.ok) {
            const errorText = await emailResponse.text();
            console.error('EmailJS API error:', errorText);
            throw new Error(`EmailJS API responded with status: ${emailResponse.status}`);
        }

        res.status(200).json({
            success: true,
            message: 'Email sent successfully'
        });

    } catch (error) {
        console.error('Error in sendRequestTemplate:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send email',
            error: error.message
        });
    }
});

// Generate PDF for Invoice Form
app.post('/api/generateInvoicePDF', async (req, res) => {
    try {
        const formData = req.body;
        
        if (!formData || formData._typename !== 'Invoice Form') {
            return res.status(400).json({ 
                error: 'Invalid form data or not an invoice form' 
            });
        }

        console.log('Starting PDF generation...');
        let pdfDoc;
        
        try {
            const templatePath = path.join(__dirname, 'assets', 'InvoiceForm.pdf');
            const templateBytes = await fs.promises.readFile(templatePath);
            pdfDoc = await PDFDocument.load(templateBytes);
        } catch (error) {
            console.warn('Could not load InvoiceForm.pdf template, creating a blank A4 page instead.', error);
            pdfDoc = await PDFDocument.create();
            pdfDoc.addPage([595, 842]);
        }

        let page = pdfDoc.getPage(0);
        const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const fontSize = 10;
        const textColor = rgb(0, 0, 0);

        // Work Information DONE!!
        page.drawText(formData.WorkTicketID || 'N/A', { x: 100, y: 830, size: fontSize, font: helveticaFont, color: textColor });
        page.drawText(formData.InvoiceDate || 'N/A', { x: 46.8, y: 806, size: fontSize, font: helveticaFont, color: textColor });
        page.drawText(formData.Spooler || 'N/A', { x: 62.9, y: 783, size: fontSize, font: helveticaFont, color: textColor });
        page.drawText(formData.WorkType || 'N/A', { x: 77.5, y: 763, size: fontSize, font: helveticaFont, color: textColor });
        page.drawText(formData.CableCompany || 'N/A', { x: 108, y: 722, size: fontSize, font: helveticaFont, color: textColor });
        page.drawText(formData.CableCompanyLocation || 'N/A', { x: 152, y: 698, size: fontSize, font: helveticaFont, color: textColor });
        page.drawText(formData.OilCompany || 'N/A', { x: 91.4, y: 675, size: fontSize, font: helveticaFont, color: textColor });
        page.drawText(formData.WellNumber?.toString() || 'N/A', { x: 407.3, y: 696, size: fontSize, font: helveticaFont, color: textColor });
        page.drawText(formData.WellNumberName || 'N/A', { x: 405.3, y: 675, size: fontSize, font: helveticaFont, color: textColor });

        // Job Type Checkboxes
        const checkboxSize = 12;
        const jobTypes = formData.JobType || [];
        
        // Row 1
        if (jobTypes.includes('Install')) {
            page.drawText('X', { x: 52, y: 524, size: checkboxSize, font: helveticaFont, color: textColor });
        }
        if (jobTypes.includes('Pull')) {
            page.drawText('X', { x: 52, y: 500, size: checkboxSize, font: helveticaFont, color: textColor });
        }
        if (jobTypes.includes('GasLift')) {
            page.drawText('X', { x: 169, y: 526, size: checkboxSize, font: helveticaFont, color: textColor });
        }
        if (jobTypes.includes('GasInstall')) {
            page.drawText('X', { x: 169, y: 500, size: checkboxSize, font: helveticaFont, color: textColor });
        }
        // Row 2
        if (jobTypes.includes('CTSpooler')) {
            page.drawText('X', { x: 294.09, y: 526, size: checkboxSize, font: helveticaFont, color: textColor });
        }
        if (jobTypes.includes('CableSpooler')) {
            page.drawText('X', { x: 294.09, y: 500, size: checkboxSize, font: helveticaFont, color: textColor });
        }
        if (jobTypes.includes('ComboSpooler')) {
            page.drawText('X', { x: 447.67, y: 526, size: checkboxSize, font: helveticaFont, color: textColor });
        }
        if (jobTypes.includes('TechnicianLaydown')) {
            page.drawText('X', { x: 447.67, y: 500, size: checkboxSize, font: helveticaFont, color: textColor });
        }

        // Labor Costs
        let laborY = 630;
        const laborRowHeight = 18.5;
        formData.LaborCosts?.forEach((labor) => {
            page.drawText(labor.qty?.toString() || '0', { x: 327, y: laborY, size: fontSize, font: helveticaFont, color: textColor });
            page.drawText(`$${labor.rate || '0.00'}`, { x: 135, y: laborY, size: fontSize, font: helveticaFont, color: textColor });
            page.drawText(`$${labor.amount?.toFixed(2) || '0.00'}`, { x: 489, y: laborY, size: fontSize, font: helveticaFont, color: textColor });
            laborY -= laborRowHeight;
        });

        // Consumables
        let currentY = 453;
        const consumableRowHeight = 26.5;
        formData.Consumables?.forEach((consumable) => {
            page.drawText(consumable.item || 'N/A', { x: 58, y: currentY, size: fontSize, font: helveticaFont, color: textColor });
            page.drawText(consumable.qty?.toString() || '0', { x: 262, y: currentY, size: fontSize, font: helveticaFont, color: textColor });
            page.drawText(`$${consumable.rate || '0.00'}`, { x: 365, y: currentY, size: fontSize, font: helveticaFont, color: textColor });
            page.drawText(`$${consumable.amount?.toFixed(2) || '0.00'}`, { x: 489, y: currentY, size: fontSize, font: helveticaFont, color: textColor });
            currentY -= consumableRowHeight;
        });

        // Notes
        if (formData.Notes) {
            const maxWidth = 550;
            const lineHeight = 14;
            let currentY = 150;
            const words = formData.Notes.split(' ');
            let line = '';
            const lines = [];

            for (const word of words) {
                const testLine = line ? `${line} ${word}` : word;
                const width = helveticaFont.widthOfTextAtSize(testLine, fontSize);
                if (width <= maxWidth) {
                    line = testLine;
                } else {
                    if (line) {
                        lines.push(line);
                    }
                    line = word;
                }
            }
            if (line) {
                lines.push(line);
            }

            for (const lineText of lines) {
                if (currentY < 50) {
                    page = pdfDoc.addPage([595, 842]);
                    currentY = 780;
                    page.drawText('Notes (Continued)', { x: 18, y: currentY, size: 12, font: helveticaFont, color: textColor });
                    currentY -= 35;
                }
                page.drawText(lineText, { x: 18, y: currentY, size: fontSize, font: helveticaFont, color: textColor });
                currentY -= lineHeight;
            }
        }

        // Footer
        page.drawText(formData.CableLength?.toString() || 'N/A', { x: 108, y: 70, size: fontSize, font: helveticaFont, color: textColor });
        page.drawText(formData.ReelNumber || 'N/A', { x: 292, y: 61, size: fontSize, font: helveticaFont, color: textColor });
        page.drawText(formData.CableType || 'N/A', { x: 82, y: 48, size: fontSize, font: helveticaFont, color: textColor });
        page.drawText(`$${formData.ExtraCharges?.toFixed(2) || '0.00'}`, { x: 293, y: 37, size: fontSize, font: helveticaFont, color: textColor });

        // Invoice Total
        page.drawText(`$${formData.InvoiceTotal?.toFixed(2) || ''}`, { x: 93, y: 25, size: fontSize, font: helveticaFont, color: textColor });

        // Customer Signature
        if (formData.CustomerSignature) {
            try {
                console.log('Converting signature for embedding...');
                const imageBuffer = Buffer.from(formData.CustomerSignature, 'base64');
                console.log('Embedding signature as PNG...');
                const signatureImage = await pdfDoc.embedPng(imageBuffer);
                page.drawImage(signatureImage, { x: 450, y: 36, width: 80, height: 40 });
                console.log('Signature drawn on page.');
            } catch (error) {
                console.error('Error embedding signature to PDF:', error);
            }
        }

        // Save PDF
        const pdfBytes = await pdfDoc.save();
        
        // Upload to S3
        const fileName = `invoice-${formData.WorkTicketID || 'Unknown'}-${Date.now()}.pdf`;
        const params = {
            Bucket: 'vip-completed-invoices',
            Key: fileName,
            Body: Buffer.from(pdfBytes),
            ContentType: 'application/pdf',
        };

        await s3Client.send(new PutObjectCommand(params));
        
        // Return URL that goes through our backend instead of directly to S3
        const pdfUrl = `${process.env.FRONTEND_URL || 'http://192.168.1.69:5000'}/api/pdf/${fileName}`;

        res.status(200).json({
            success: true,
            message: 'PDF generated successfully',
            pdfUrl: pdfUrl
        });

    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to generate PDF'
        });
    }
});

// Serve PDF from S3 through our backend
app.get('/api/pdf/:fileName', async (req, res) => {
    try {
        const { fileName } = req.params;
        
        const params = {
            Bucket: 'vip-completed-invoices',
            Key: fileName
        };

        const command = new GetObjectCommand(params);
        const response = await s3Client.send(command);

        // Set appropriate headers for PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        // Pipe the PDF stream to the response
        response.Body.pipe(res);
    } catch (error) {
        console.error('Error serving PDF:', error);
        res.status(404).json({ error: 'PDF not found' });
    }
});

// Error handling middleware
app.use(errorHandler);

// Start server with graceful shutdown
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});


