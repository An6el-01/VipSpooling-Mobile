// AWS Configuration for Amplify v6
export const awsConfig = {
    Auth: {
        Cognito: {
            userPoolId: 'us-east-1_Sk6JKaM2w',
            userPoolClientId: '3iefeb0g06d7te07ekdonnjlgn',
            signUpVerificationMethod: 'code',
            authenticationFlowType: 'USER_PASSWORD_AUTH'
        },
        region: 'us-east-1'
    },
    Analytics: {
        disabled: true
    },
    API: {
        GraphQL: {
            endpoint: null,
            region: 'us-east-1'
        }
    },
    Storage: {
        region: 'us-east-1'
    }
};