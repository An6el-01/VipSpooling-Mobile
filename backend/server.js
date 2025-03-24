const express = require('express');
const { 
    CognitoIdentityProviderClient, 
    AdminGetUserCommand, 
    ListUsersCommand,
    AdminListGroupsForUserCommand 
} = require('@aws-sdk/client-cognito-identity-provider');
const { S3Client, ListObjectsV2Command, ListBucketsCommand } = require('@aws-sdk/client-s3');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
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

// Try to load the schema, but don't fail if it's not found
let verifyPasswordSchema;
try {
    verifyPasswordSchema = require('./schemas/verifyPassword');
} catch (error) {
    console.warn('Warning: verifyPassword schema not found. Password verification will be disabled.');
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

// Get all users from Cognito
app.get('/api/users', async (req, res) => {
    try {
        const params = {
            UserPoolId: process.env.USER_POOL_ID,
            Limit: 60 // Adjust this number based on your needs
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


