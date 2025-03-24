import { setAuth, setUser, setUserGroups, setUserAttributes } from '../store/authSlice';

const Login = () => {
    const handleLogin = async () => {
        try {
            console.log('Starting login process');
            setLoading(true);
            setError(null);

            console.log('Attempting Cognito sign in');
            const user = await Auth.signIn(email, password);
            console.log('Cognito sign in successful:', user);

            console.log('Getting current session');
            const session = await Auth.currentSession();
            console.log('Got session');
            
            const accessToken = session.getAccessToken().getJwtToken();
            console.log('Got access token');
            
            console.log('Fetching user data from backend');
            const response = await fetch(`${endpoints.users}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                console.error('Backend response not OK:', response.status);
                throw new Error('Failed to fetch user data');
            }

            const data = await response.json();
            console.log('Received user data from backend:', data);
            
            const currentUser = data.users.find(u => u.email === email);
            console.log('Found current user:', currentUser);
            
            if (currentUser) {
                console.log('Updating Redux state with user data');
                // Store user information in Redux
                dispatch(setAuth(true));
                dispatch(setUser(user));
                dispatch(setUserGroups(currentUser.groups));
                dispatch(setUserAttributes({
                    name: currentUser.name,
                    email: currentUser.email,
                    role: currentUser.groups[0] || 'User'
                }));
                console.log('Redux state updated successfully');

                // Navigate to the main app
                console.log('Navigating to MainTabs');
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'MainTabs' }],
                });
            } else {
                console.error('No matching user found for email:', email);
                throw new Error('User not found in the system');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err.message || 'Failed to login. Please try again.');
        } finally {
            setLoading(false);
            console.log('Login process completed');
        }
    };
} 