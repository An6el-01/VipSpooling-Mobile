import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, ImageBackground, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Card from '../../components/Card';
import { useSelector } from 'react-redux';

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
        alignItems: 'center',
    },
    logoImage: {
        position: 'relative',
        bottom: 125,
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
    inputFieldContainer: {
        width: '100%',
        marginBottom: 20,
    },
    inputField: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#000',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 15,
        marginBottom: 15,
    },
    inputIcon: {
        width: 30,
        height: 30,
        marginRight: 20,
    },
    inputText: {
        color: '#fff',
        fontSize: 16,
        flex: 1,
    },
    signInButton: {
        backgroundColor: '#F7AD00',
        borderRadius: 5,
        borderWidth: 1.3,
        borderColor: '#000',
        paddingVertical: 10,
        paddingHorizontal: 50,
        borderRadius: 5,
        marginBottom: 10,
        marginTop: 20,
    },
    signInButtonText: {
        color: '#000',
        fontWeight: '600',
        fontSize: 16,
    },
    goBackButton: {
        position: 'absolute',
        top: 30, // Distance from the top
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
        color: '#000',
        fontWeight: '600',
    },
});

const SignIn = () => {
    const navigation = useNavigation();
    const isDarkMode = useSelector((state) => state.theme.isDarkMode);

    const backgroundImage = isDarkMode
    ? require('../../assets/DarkMode.jpg')
    : require('../../assets/LightMode.jpg')

    return (
        <ImageBackground source={backgroundImage} style={styles.background}>
            <KeyboardAvoidingView style= {styles.container} behavior='padding'>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.container}>
                        {/* Go Back Button */}
                        <TouchableOpacity
                            style={styles.goBackButton}
                            onPress={() => {
                                navigation.navigate('Welcome');
                            }}
                        >
                            <Image
                                source={require('../../assets/arrowBack.png')}
                                style={styles.goBackIcon}
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
                                <View style={styles.inputField}>
                                    <Image
                                        source={require('../../assets/mail.png')}
                                        style={styles.inputIcon}
                                    />
                                    <TextInput
                                        placeholder="Email Address"
                                        placeholderTextColor="#aaa"
                                        style={styles.inputText}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />
                                </View>
                                {/* PASSWORD INPUT FIELD */}
                                <View style={styles.inputField}>
                                    <Image
                                        source={require('../../assets/padlock.png')}
                                        style={styles.inputIcon}
                                    />
                                    <TextInput
                                        placeholder="Password"
                                        placeholderTextColor="#aaa"
                                        style={styles.inputText}
                                        secureTextEntry={true}
                                    />
                                </View>

                                {/* SIGN-IN BUTTON */}
                                <TouchableOpacity style={styles.signInButton} onPress={navigation.navigate('Home')}>
                                    <Text style={[styles.signInButtonText, { color: isDarkMode ? '#000' : '#000' }]}>
                                        Sign In
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
