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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors()); // Enable CORS for all routes

const cognitoClient = new CognitoIdentityProviderClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

// Function to get user groups
async function getUserGroups(username) {
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
        return [];
    }
}

// Verify if user exists and has temporary password status
app.post('/api/users/verify-temp-password', async (req, res) => {
    try {
        const { email } = req.body;

        const params = {
            UserPoolId: process.env.USER_POOL_ID,
            Username: email
        };

        const command = new AdminGetUserCommand(params);
        const response = await cognitoClient.send(command);

        // Check if user needs to change password
        const userStatus = response.UserStatus;
        const needsNewPassword = userStatus === 'FORCE_CHANGE_PASSWORD';

        res.status(200).json({ 
            exists: true, 
            needsNewPassword,
            email: email 
        });
    } catch (error) {
        if (error.name === 'UserNotFoundException') {
            res.status(404).json({ exists: false });
        } else {
            console.error('Error verifying user:', error);
            res.status(500).json({ error: error.message });
        }
    }
});

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

// Function to list all available S3 buckets
async function listBuckets() {
    try {
        const command = new ListBucketsCommand({});
        const response = await s3Client.send(command);
        console.log('Available buckets:', response.Buckets.map(bucket => bucket.Name));
        return response.Buckets;
    } catch (error) {
        console.error('Error listing buckets:', error);
        throw error;
    }
}

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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


