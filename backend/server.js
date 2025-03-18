const express = require('express');
const { 
    CognitoIdentityProviderClient, 
    AdminGetUserCommand, 
    ListUsersCommand,
    AdminListGroupsForUserCommand 
} = require('@aws-sdk/client-cognito-identity-provider');
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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


