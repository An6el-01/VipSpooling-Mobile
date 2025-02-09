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
    inputFieldContainer: {
        width: '100%',
        marginBottom: 20,
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
                            Sign In
                        </Text>

                        {/* CARD COMPONENT */}
                        <Card isDarkMode={isDarkMode}>
                            <View style={styles.cardContainerContent}>
                                {/* EMAIL INPUT FIELD */}
                                <Text style={[styles.fieldText, { color: isDarkMode ? '#fff' : '#000'}]}>Email</Text>
                                <View style={[styles.inputField, {borderColor: isDarkMode ? '#fff' : '#000'}]}>
                                    <Image
                                        source={require('../../assets/mail.png')}
                                        style={styles.inputIcon}
                                    />
                                    <TextInput
                                        placeholder="Email Address"
                                        placeholderTextColor={isDarkMode ? '#5e5e5e' : '#aaa'}
                                        style={styles.inputText}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />
                                </View>
                                {/* PASSWORD INPUT FIELD */}
                                <Text style={[styles.fieldText, { color: isDarkMode ? '#fff' : '#000'}]}>Password</Text>
                                <View style={[styles.inputField, {borderColor: isDarkMode ? '#fff' : '#000'}]}>
                                    <Image
                                        source={require('../../assets/padlock.png')}
                                        style={styles.inputIcon}
                                    />
                                    <TextInput
                                        placeholder="Password"
                                        placeholderTextColor={isDarkMode ? '#5e5e5e' : '#aaa'}
                                        style={styles.inputText}
                                        secureTextEntry={true}
                                    />
                                </View>

                                {/* SIGN-IN BUTTON */}
                                <TouchableOpacity style={styles.signInButton} onPress={() => navigation.navigate('Home')}>
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
