import { AWS_REGION, USER_POOL_ID, USER_POOL_WEB_CLIENT_ID } from '@env';

// Log configuration values (remove in production)
console.log('AWS Configuration:', {
    region: AWS_REGION,
    userPoolId: USER_POOL_ID,
    userPoolClientId: USER_POOL_WEB_CLIENT_ID
});

// Verify configuration values
if (!AWS_REGION || !USER_POOL_ID || !USER_POOL_WEB_CLIENT_ID) {
    console.error('Missing AWS configuration values:', {
        hasRegion: !!AWS_REGION,
        hasUserPoolId: !!USER_POOL_ID,
        hasUserPoolClientId: !!USER_POOL_WEB_CLIENT_ID
    });
}

// AWS Configuration for Amplify v6
export const awsConfig = {
    Auth: {
        Cognito: {
            userPoolId: USER_POOL_ID,
            userPoolClientId: USER_POOL_WEB_CLIENT_ID,
            signUpVerificationMethod: 'code',
        },
        region: AWS_REGION
    },
    Analytics: {
        disabled: true
    },
    API: {
        GraphQL: {
            endpoint: null,
            region: AWS_REGION
        }
    },
    Storage: {
        region: AWS_REGION
    }
};