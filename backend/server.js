const express = require('express');
const { CognitoIdentityProviderClient, AdminGetUserCommand } = require('@aws-sdk/client-cognito-identity-provider');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

const cognitoClient = new CognitoIdentityProviderClient({
    region: process.env.AWS_REGION
});

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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


