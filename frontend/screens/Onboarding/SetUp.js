import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, ImageBackground, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Card from '../../components/Card';
import { useAppSelector, useAppDispatch } from '../../hooks/hooks';
import { auth } from '../../services/auth';
import { setAuth, setUserAttributes } from '../../store/authSlice';

const styles = StyleSheet.create({
    background:{
        flex: 1,
        resizeMode: 'cover',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    cardContainerContent: {
        justifyContent: 'center',
    },
    logoImage: {
        position: 'relative',
        bottom: 20,
        width: 120,
        height: 100,
        marginBottom: 20,
    },
    title: {
        position: 'relative',
        bottom: 10,
        fontSize: 25,
        fontWeight: '700',
        marginBottom: 20,
        color: '#000',
    },
    inputField: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EAE7E7',
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 14,
        marginBottom: 22,
        width: '100%',
    },
    fieldText: {
        position: 'relative',
        marginBottom: 15,
        fontSize: 16,
        fontWeight: '600',
    },
    inputIcon: {
        width: 30,
        height: 30,
        marginRight: 20,
        tintColor: '#000',
    },
    inputText: {
        color: '#000',
        fontSize: 16,
        flex: 1,
    },
    continueButton: {
        backgroundColor: '#FFD700',
        borderRadius: 12,  
        borderWidth: 1.3,
        borderColor: '#000',
        paddingVertical: 14,  
        paddingHorizontal: 50,
        alignItems: 'center',  
        justifyContent: 'center',
        width: '100%',  
        alignSelf: 'center',  
        shadowColor: '#000',  
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3, 
    },
    continueButtonText: {
        color: '#000',
        fontWeight: '600',
        fontSize: 16,
        textAlign: 'center',
    },
    goBackButton: {
        position: 'absolute',
        top: 35, // Distance from the top
        left: 2, // Distance from the left
        flexDirection: 'column', // Align icon and text horizontally
        alignItems: 'center',
    },
    goBackIcon: {
        width: 24, // Adjusted size
        height: 24,
        marginRight: 5, // Space between icon and text
    },
    goBackText: {
        fontSize: 16,
        fontWeight: '600',
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginBottom: 10,
        textAlign: 'center',
    },
});

const SetUp = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
    const [name, setName] = useState('');
    const [email] = useState(route.params?.email || '');
    const [temporaryPassword] = useState(route.params?.temporaryPassword || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();

    const backgroundImage = isDarkMode
        ? require('../../assets/DarkMode.jpg')
        : require('../../assets/LightMode.jpg');

    const handleSignUp = async () => {
        if (!name || !password || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // Password validation
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            setError('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character');
            return;
        }

        try {
            setError('');
            setLoading(true);

            console.log('Attempting sign in with temporary password');
            
            // First, sign in with the temporary password
            const signInResult = await auth.signIn(email, temporaryPassword);
            console.log('Sign in response:', signInResult);

            if (signInResult.challengeName === 'NEW_PASSWORD_REQUIRED') {
                console.log('Completing new password challenge');
                
                // Complete the new password challenge
                const result = await auth.completeNewPassword(email, signInResult.session, password);
                console.log('Password change result:', result);

                if (result.isSignedIn && result.tokens) {
                    // Update Redux state
                    dispatch(setAuth({
                        accessToken: result.tokens.accessToken,
                        idToken: result.tokens.idToken,
                        refreshToken: result.tokens.refreshToken,
                        isAuthenticated: true
                    }));

                    dispatch(setUserAttributes({
                        name: name,
                        email: email,
                        role: 'user' // Default role, will be updated when fetching user data
                    }));

                    // Navigate to home screen
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Home' }],
                    });
                } else {
                    throw new Error('Failed to complete password change');
                }
            } else {
                throw new Error('Unexpected authentication state');
            }
        } catch (err) {
            console.error('SetUp-handleSignUp() => Error:', err);
            
            if (err.message?.includes('Password does not conform to policy')) {
                setError('Your password must include at least 8 characters, uppercase and lowercase letters, numbers, and special characters');
            } else if (err.message?.includes('Invalid session')) {
                setError('Your session has expired. Please start over from the invitation link.');
                navigation.navigate('Welcome');
            } else {
                setError('Failed to set up your account. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <ImageBackground source={backgroundImage} style={styles.background}>
            <KeyboardAvoidingView style={styles.container} behavior='padding'>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.container}>
                        {/* Go Back Button */}
                        <TouchableOpacity
                            style={styles.goBackButton}
                            onPress={() => navigation.navigate('Welcome')}
                        >
                            <Image
                                source={require('../../assets/arrowBack.png')}
                                style={[styles.goBackIcon, {tintColor: isDarkMode ? '#fff' : '#000'}]}
                            />
                            <Text style={[styles.goBackText, { color: isDarkMode ? '#fff' : '#000' }]}>
                                Go Back
                            </Text>
                        </TouchableOpacity>

                        {/* LOGO */}
                        <Image
                            source={require('../../assets/VipSpoolingLogo.png')}
                            style={styles.logoImage}
                            resizeMode="contain"
                        />

                        {/* TITLE */}
                        <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#000' }]}>
                            Set up your profile ✍️
                        </Text>

                        {/* CARD COMPONENT */}
                        <Card isDarkMode={isDarkMode}>
                            <View style={styles.cardContainerContent}>
                                {/* NAME INPUT FIELD */}
                                <Text style={[styles.fieldText, { color: isDarkMode ? '#fff' : '#000' }]}>Name</Text>
                                <View style={[styles.inputField, { borderColor: isDarkMode ? '#fff' : '#000' }]}>
                                    <TextInput
                                        placeholder="Full Name"
                                        placeholderTextColor={isDarkMode ? "#5e5e5e" : '#aaa'}
                                        style={[styles.inputText, { color: isDarkMode ? '#fff' : '#000' }]}
                                        value={name}
                                        onChangeText={setName}
                                        keyboardType='ascii-capable'
                                        autoCapitalize='words'
                                    />
                                </View>

                                {/* EMAIL DISPLAY */}
                                <Text style={[styles.fieldText, { color: isDarkMode ? '#fff' : '#000' }]}>Email</Text>
                                <View style={[styles.inputField, { borderColor: isDarkMode ? '#fff' : '#000' }]}>
                                    <Text style={[styles.inputText, { color: isDarkMode ? '#fff' : '#000' }]}>
                                        {email}
                                    </Text>
                                </View>

                                {/* NEW PASSWORD INPUT FIELD */}
                                <Text style={[styles.fieldText, { color: isDarkMode ? '#fff' : '#000' }]}>New Password</Text>
                                <View style={[styles.inputField, { borderColor: isDarkMode ? '#fff' : '#000' }]}>
                                    <TextInput
                                        placeholder="Enter new password"
                                        placeholderTextColor={isDarkMode ? '#5e5e5e' : '#aaa'}
                                        style={[styles.inputText, { color: isDarkMode ? '#fff' : '#000' }]}
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry={true}
                                    />
                                </View>

                                {/* CONFIRM PASSWORD INPUT FIELD */}
                                <Text style={[styles.fieldText, { color: isDarkMode ? '#fff' : '#000' }]}>Confirm New Password</Text>
                                <View style={[styles.inputField, { borderColor: isDarkMode ? '#fff' : '#000' }]}>
                                    <TextInput
                                        placeholder="Confirm new password"
                                        placeholderTextColor={isDarkMode ? '#5e5e5e' : '#aaa'}
                                        style={[styles.inputText, { color: isDarkMode ? '#fff' : '#000' }]}
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                        secureTextEntry={true}
                                    />
                                </View>

                                {/* ERROR MESSAGE */}
                                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                                {/* CONTINUE BUTTON */}
                                <TouchableOpacity 
                                    style={[styles.continueButton, loading && { opacity: 0.7 }]} 
                                    onPress={handleSignUp}
                                    disabled={loading}
                                >
                                    <Text style={styles.continueButtonText}>
                                        {loading ? 'Setting up...' : 'Continue'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </Card>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
};

export default SetUp;
