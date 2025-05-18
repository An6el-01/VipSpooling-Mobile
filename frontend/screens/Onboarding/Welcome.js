import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ImageBackground, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '../../hooks/hooks';
import Card from '../../components/Card';
import { auth } from '../../services/auth';  // Import the auth service instead of Amplify

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    cardContentContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    logoImage: {
        position: 'relative',
        bottom: 95,
        width: 120,
        height: 100,
        marginBottom: 20,
    },
    title: {
        position: 'relative',
        bottom: 20,
        fontSize: 25,
        fontWeight: '700',
        marginBottom: 20,
        color: '#000',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 25,
        paddingHorizontal: 20,
    },
    emailInput: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EAE7E7',
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 14,
        marginBottom: 22,
        width: '100%',
        borderWidth: 1.3,
    },
    inputIcon: {
        width: 24,
        height: 24,
        marginRight: 10,
        tintColor: '#000',
    },
    inputText: {
        flex: 1,
        fontSize: 16,
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
        borderWidth: 1,
        borderColor: '#000',
    },
    submitButton: {
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
        marginBottom: 20,
    },
    submitButtonText: {
        color: '#000',
        fontWeight: '600',
        fontSize: 16,
    },
    existingAccountText: {
        fontSize: 14,
        color: '#000',
        margin: 5,
        textAlign: 'center',
        fontWeight: '600',
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginBottom: 10,
        textAlign: 'center',
    },
    loadingText: {
        color: '#666',
        fontSize: 14,
        marginTop: 10,
        textAlign: 'center',
    },
    clickableText: {
        color: '#0000FF',
        fontSize: 14,
        fontWeight: '600',
    },
});

const Welcome = () => {
    const navigation = useNavigation();
    const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
    const [email, setEmail] = useState('');
    const [temporaryPassword, setTemporaryPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const backgroundImage = isDarkMode
        ? require('../../assets/DarkMode.jpg')
        : require('../../assets/LightMode.jpg');

    const handleSubmit = async () => {
        if (!email || !temporaryPassword) {
            setError('Please enter both email and temporary password');
            return;
        }

        // Clean up email address
        const cleanEmail = email.replace('mailto:', '').trim();

        if (!cleanEmail.includes('@')) {
            setError('Please enter a valid email address');
            return;
        }

        setLoading(true);
        setError('');

        try {
            console.log('Attempting sign in for:', cleanEmail);
            
            const result = await auth.signIn(cleanEmail, temporaryPassword);
            console.log('Sign in response:', result);

            if (result.challengeName === 'NEW_PASSWORD_REQUIRED') {
                // Navigate to SetUp with the session
                navigation.navigate('SetUp', { 
                    email: cleanEmail,
                    temporaryPassword: temporaryPassword,
                    session: result.session,
                    userAttributes: result.userAttributes
                });
            } else if (result.isSignedIn) {
                // User already has a permanent password
                navigation.navigate('SignIn');
            }
        } catch (err) {
            console.error('Welcome-handleSubmit() => Auth error:', err);
            
            if (err.message?.includes('Incorrect username or password')) {
                setError('The temporary password is incorrect. Please check your email and try again.');
            } else if (err.message?.includes('Password attempts exceeded')) {
                setError('Too many incorrect attempts. Please try again later.');
            } else if (err.message?.includes('User does not exist')) {
                setError('This account does not exist. Please check your email address.');
            } else {
                setError(err.message || 'There was a problem signing in. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <ImageBackground source={backgroundImage} style={styles.background}>
            <KeyboardAvoidingView style={styles.container} behavior='padding' keyboardVerticalOffset={1}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.container}>
                        {/* LOGO */}
                        <Image
                            source={require('../../assets/VipSpoolingLogo.png')}
                            style={styles.logoImage}
                            resizeMode="contain"
                        />

                        {/* TITLE */}
                        <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#000' }]}>
                            Welcome to VIP Spooling
                        </Text>

                        {/* Card Component */}
                        <Card isDarkMode={isDarkMode}>
                            <View style={styles.cardContentContainer}>
                                {/* Email Input */}
                                <View style={[styles.emailInput, { borderColor: isDarkMode ? '#fff' : '#000' }]}>
                                    <Image 
                                        source={require('../../assets/mail.png')} 
                                        style={[styles.inputIcon, { tintColor: isDarkMode ? '#fff' : '#000' }]} 
                                    />
                                    <TextInput
                                        placeholder="Enter your email"
                                        placeholderTextColor={isDarkMode ? '#5e5e5e' : '#aaa'}
                                        style={[styles.inputText, { color: isDarkMode ? '#fff' : '#000' }]}
                                        value={email}
                                        onChangeText={setEmail}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />
                                </View>

                                {/* Temporary Password Input */}
                                <View style={[styles.inputField, { borderColor: isDarkMode ? '#fff' : '#000' }]}>
                                    <Image 
                                        source={require('../../assets/padlock.png')} 
                                        style={[styles.inputIcon, { tintColor: isDarkMode ? '#fff' : '#000' }]} 
                                    />
                                    <TextInput
                                        placeholder="Enter temporary password"
                                        placeholderTextColor={isDarkMode ? '#5e5e5e' : '#aaa'}
                                        style={[styles.inputText, { color: isDarkMode ? '#fff' : '#000' }]}
                                        value={temporaryPassword}
                                        onChangeText={setTemporaryPassword}
                                        secureTextEntry={true}
                                        autoCapitalize="none"
                                    />
                                </View>

                                {error ? <Text style={styles.errorText}>{error}</Text> : null}
                                {loading ? <Text style={styles.loadingText}>Validating...</Text> : null}

                                {/* SUBMIT BUTTON */}
                                <TouchableOpacity 
                                    style={[styles.submitButton, loading && { opacity: 0.7 }]} 
                                    onPress={handleSubmit}
                                    disabled={loading}
                                >
                                    <Text style={[styles.submitButtonText, { color: isDarkMode ? '#000' : '#000' }]}>
                                        {loading ? 'Validating...' : 'Continue'}
                                    </Text>
                                </TouchableOpacity>

                                {/* EXISTING ACCOUNT SECTION */}
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={[styles.existingAccountText, { color: isDarkMode ? '#fff' : '#000' }]}>
                                        Already Have An Account? 
                                    </Text>
                                    <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                                        <Text style={styles.clickableText}>Sign In</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Card>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
};

export default Welcome;