import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, ImageBackground, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Card from '../../components/Card';
import { useAppSelector, useAppDispatch } from '../../hooks/hooks';
import { auth } from '../../services/auth';

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
        bottom: 100,
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
        width:'100%',
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
    signInButton: {
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
    signInButtonText: {
        color: '#000',
        fontWeight: '600',
        fontSize: 16,
        textAlign: 'center',
    },
    goBackButton: {
        position: 'absolute',
        top: 35, 
        left: 2, 
        flexDirection: 'column', 
        alignItems: 'center',
    },
    goBackIcon: {
        width: 24, 
        height: 24,
        marginRight: 5, 
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

const SignIn = () => {
    const navigation = useNavigation();
    const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
    const dispatch = useAppDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const backgroundImage = isDarkMode
    ? require('../../assets/DarkMode.jpg')
    : require('../../assets/LightMode.jpg');

    const handleSignIn = async () => {
        if (!email || !password) {
            setError('Please enter both email and password');
            return;
        }

        try {
            setError('');
            setLoading(true);
            console.log('Starting authentication for:', email);

            // Sign in using our custom auth service
            const result = await auth.signIn(email, password);
            console.log('Sign in successful:', result);

            if (result.isSignedIn && result.tokens) {
                // First dispatch the auth state
                dispatch({
                    type: 'auth/setAuth',
                    payload: {
                        accessToken: result.tokens.accessToken,
                        idToken: result.tokens.idToken,
                        refreshToken: result.tokens.refreshToken,
                        isAuthenticated: true
                    }
                });

                // Then set some basic user attributes
                dispatch({
                    type: 'auth/setUserAttributes',
                    payload: {
                        email: email,
                        name: email.split('@')[0], // Basic name from email
                        role: 'user'
                    }
                });

                console.log('Auth state updated, navigating to Home...');
                navigation.navigate('Home');
            }
        } catch (err) {
            console.error('SignIn error:', err);
            let errorMessage = 'Sign-in failed. ';
            
            // Handle specific error cases
            if (err.message.includes('UserNotFoundException')) {
                errorMessage += 'User not found.';
            } else if (err.message.includes('NotAuthorizedException')) {
                errorMessage += 'Incorrect username or password.';
            } else if (err.message.includes('UserNotConfirmedException')) {
                errorMessage += 'Please verify your email first.';
            } else if (err.message.includes('InvalidParameterException')) {
                errorMessage += 'Please check your email format.';
            } else {
                errorMessage += err.message;
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            {/* Go Back Button */}
            <TouchableOpacity
              style={styles.goBackButton}
              onPress={() => navigation.navigate('Welcome')}
            >
              <Image
                source={require('../../assets/arrowBack.png')}
                style={[styles.goBackIcon, { tintColor: isDarkMode ? '#fff' : '#000' }]}
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
              Sign In
            </Text>

            {/* CARD COMPONENT */}
            <Card isDarkMode={isDarkMode}>
              <View style={styles.cardContainerContent}>
                {/* EMAIL INPUT FIELD */}
                <Text style={[styles.fieldText, { color: isDarkMode ? '#fff' : '#000' }]}>Email</Text>
                <View style={[styles.inputField, { borderColor: isDarkMode ? '#fff' : '#000' }]}>
                  <Image source={require('../../assets/mail.png')} style={styles.inputIcon} />
                  <TextInput
                    placeholder="Email Address"
                    placeholderTextColor={isDarkMode ? '#5e5e5e' : '#aaa'}
                    style={styles.inputText}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>
                {/* PASSWORD INPUT FIELD */}
                <Text style={[styles.fieldText, { color: isDarkMode ? '#fff' : '#000' }]}>Password</Text>
                <View style={[styles.inputField, { borderColor: isDarkMode ? '#fff' : '#000' }]}>
                  <Image source={require('../../assets/padlock.png')} style={styles.inputIcon} />
                  <TextInput
                    placeholder="Password"
                    placeholderTextColor={isDarkMode ? '#5e5e5e' : '#aaa'}
                    style={styles.inputText}
                    secureTextEntry={true}
                    value={password}
                    onChangeText={setPassword}
                  />
                </View>

                {/* ERROR MESSAGE */}
                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                {/* SIGN-IN BUTTON */}
                <TouchableOpacity 
                    style={[styles.signInButton, loading && { opacity: 0.7 }]} 
                    onPress={handleSignIn}
                    disabled={loading}
                >
                    <Text style={[styles.signInButtonText, { color: isDarkMode ? '#000' : '#000' }]}>
                        {loading ? 'Signing in...' : 'Sign In'}
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

export default SignIn;
