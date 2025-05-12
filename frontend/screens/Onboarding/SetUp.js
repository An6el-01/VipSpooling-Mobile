import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, ImageBackground, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Card from '../../components/Card';
import { useAppSelector } from '../../hooks/hooks';
import { signIn, confirmSignIn, updatePassword } from 'aws-amplify/auth';

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
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

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

        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        try {
            setError('');
            setLoading(true);

            // First, sign in with the temporary password
            const { nextStep, signInOutput } = await signIn({
                username: email,
                password: '1234' // temporary password from email
            });

            if (nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD') {
                // Complete the new password challenge with v6 syntax
                await confirmSignIn({
                    challengeResponse: password,
                    options: {
                        userAttributes: {
                            name: name
                        }
                    }
                });

                // Update user attributes if needed
                await updatePassword({
                    oldPassword: '1234',
                    newPassword: password
                });

                console.log('SetUp-handleSignUp() => Sign-up success');
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Home' }],
                });
            }
        } catch (err) {
            console.error('SetUp-handleSignUp() => Sign-up failed:', err);
            setError(err.message || 'Sign-up failed. Please try again.');
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
