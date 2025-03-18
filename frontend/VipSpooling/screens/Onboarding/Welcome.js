import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ImageBackground, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Card from '../../components/Card';
import { Auth } from 'aws-amplify';

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
    const isDarkMode = useSelector((state) => state.theme.isDarkMode);
    const [temporaryPassword, setTemporaryPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const backgroundImage = isDarkMode
        ? require('../../assets/DarkMode.jpg')
        : require('../../assets/LightMode.jpg');
/**
 * Handles the submission of the temporary password from the welcome screen
 * Utilizes the Auth.SignIn() method from AWS Amplify to sign in the user.
 * @returns {void}
 */
    const handleSubmit = async () => {
        if (!temporaryPassword) {
            setError('Please enter your temporary password');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Sign in with temporary password
            const user = await Auth.signIn('a.m.salinas1901@gmail.com', temporaryPassword);
            
            // If sign in successful and password change required
            if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
                navigation.navigate('SetUp', { 
                    email: 'a.m.salinas1901@gmail.com',
                    user: user // Pass the user object to complete the challenge
                });
            } else {
                // If user has already set up their password, send them to sign in
                navigation.navigate('SignIn');
            }
        } catch (err) {
            setError('Invalid temporary password. Please try again.');
            console.error('Welcome-handleSubmit() => Auth failed:', err);
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
                                {/* TEMPORARY PASSWORD INPUT */}
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