import { Buffer } from 'buffer';

const COGNITO_REGION = 'us-east-1';
const USER_POOL_ID = 'us-east-1_Sk6JKaM2w';
const CLIENT_ID = '3iefeb0g06d7te07ekdonnjlgn';

const base64Encode = (str) => {
    return Buffer.from(str).toString('base64');
};

export const auth = {
    signIn: async (username, password) => {
        try {
            const params = {
                AuthFlow: 'USER_PASSWORD_AUTH',
                ClientId: CLIENT_ID,
                AuthParameters: {
                    USERNAME: username,
                    PASSWORD: password
                }
            };

            console.log('Attempting to sign in with params:', {
                ...params,
                AuthParameters: { USERNAME: username, PASSWORD: '***' }
            });

            const response = await fetch(
                `https://cognito-idp.${COGNITO_REGION}.amazonaws.com`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-amz-json-1.1',
                        'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth'
                    },
                    body: JSON.stringify(params)
                }
            );

            const data = await response.json();
            console.log('Sign in response:', {
                status: response.status,
                ok: response.ok,
                data: data
            });

            if (!response.ok) {
                throw new Error(data.message || data.__type || 'Authentication failed');
            }

            // Handle NEW_PASSWORD_REQUIRED challenge
            if (data.ChallengeName === 'NEW_PASSWORD_REQUIRED') {
                return {
                    challengeName: 'NEW_PASSWORD_REQUIRED',
                    session: data.Session,
                    userAttributes: JSON.parse(data.ChallengeParameters.userAttributes || '{}'),
                    requiredAttributes: JSON.parse(data.ChallengeParameters.requiredAttributes || '[]')
                };
            }

            if (!data.AuthenticationResult) {
                throw new Error('No authentication result received');
            }

            return {
                isSignedIn: true,
                tokens: {
                    accessToken: data.AuthenticationResult.AccessToken,
                    idToken: data.AuthenticationResult.IdToken,
                    refreshToken: data.AuthenticationResult.RefreshToken
                }
            };
        } catch (error) {
            console.error('Sign in error:', error);
            // Enhance error message based on known Cognito error types
            if (error.message.includes('UserNotFoundException')) {
                throw new Error('User not found');
            } else if (error.message.includes('NotAuthorizedException')) {
                throw new Error('Incorrect username or password');
            } else if (error.message.includes('UserNotConfirmedException')) {
                throw new Error('Please verify your email first');
            }
            throw error;
        }
    },

    completeNewPassword: async (username, session, newPassword) => {
        try {
            const params = {
                ChallengeName: 'NEW_PASSWORD_REQUIRED',
                ClientId: CLIENT_ID,
                ChallengeResponses: {
                    USERNAME: username,
                    NEW_PASSWORD: newPassword
                },
                Session: session
            };

            const response = await fetch(
                `https://cognito-idp.${COGNITO_REGION}.amazonaws.com`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-amz-json-1.1',
                        'X-Amz-Target': 'AWSCognitoIdentityProviderService.RespondToAuthChallenge'
                    },
                    body: JSON.stringify(params)
                }
            );

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || data.__type || 'Failed to set new password');
            }

            return {
                isSignedIn: true,
                tokens: {
                    accessToken: data.AuthenticationResult.AccessToken,
                    idToken: data.AuthenticationResult.IdToken,
                    refreshToken: data.AuthenticationResult.RefreshToken
                }
            };
        } catch (error) {
            console.error('Complete new password error:', error);
            throw error;
        }
    },

    signOut: async () => {
        // For Expo Go, we just need to clear the local storage
        // You can add AsyncStorage clearing here if needed
        return Promise.resolve();
    },

    getCurrentSession: async () => {
        // This should be implemented with your Redux store
        // For now, return null to indicate no session
        return null;
    }
}; 