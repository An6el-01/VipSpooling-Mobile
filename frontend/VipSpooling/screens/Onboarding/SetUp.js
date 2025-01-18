import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, TextInput, Image, ImageBackground, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Card from '../../components/Card';
import { useSelector } from 'react-redux';

const styles = StyleSheet.create({
    background: {
        flex:1,
        resizeMode: 'cover',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    cardContainerContent: {
        justifyContent:'center',
        alignItems:'center',
    },
    logoImage: {
        position:'relative',
        bottom: 70,
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
    inputText: {
        color: '#fff',
        fontSize: 16,
        flex: 1,
    },
    continueButton: {
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
    continueButtonText: {
        color: '#000',
        fontWeight: '600',
        fontSize: 16,
    },
    disabledButton: {
        backgroundColor: '#838383'
    },
    goBackButton: {
        position: 'absolute',
        top: 30,
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
        color: '#000',
        fontWeight: '600',
    },
    termsContainer: {
        flexDirection: 'row',
        alignItems:'center',
        justifyContent:'center',
        marginTop: 10,
    },
    termsText: {
        fontSize: 12,
        color: '#000',
    },
    linkText: {
        fontSize: 12,
        color: '#003BFF',
        textDecorationLine: 'underline',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 5,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 3,
    },
    checkboxTick: {
        color: '#000',
        fontSize: 16,
        fontWeight:'bold',
    },
});

const SetUp = () => {
    const navigation = useNavigation();
    const isDarkMode = useSelector((state) => state.theme.isDarkMode);
    const [isAgreed, setIsAgreed] = useState(false);

    const backgroundImage = isDarkMode
    ? require('../../assets/DarkMode.jpg')
    : require('../../assets/LightMode.jpg')

    return(
        <ImageBackground source={backgroundImage} style={styles.background}>
            <KeyboardAvoidingView style={styles.container} behavior='padding'>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.container}>
                        {/*GO BACK BUTTON*/}
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

                        {/*LOGO*/}
                        <Image
                            source={require('../../assets/VipSpoolingLogo.png')}
                            style={styles.logoImage}
                            resizeMode="contain"
                        />

                        {/*TITLE*/}
                        <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#000' }]}>
                            Set up your profile. ✍️
                        </Text>

                        {/*CARD COMPONENT*/}
                        <Card isDarkMode={isDarkMode}>
                            <View style={styles.cardContainerContent}>
                                {/*EMAIL INPUT FIELD*/}
                                <View style={styles.inputField}>
                                    <TextInput
                                        placeholder= "Full Name"
                                        placeholderTextColor="#aaa"
                                        style={styles.inputText}
                                        keyboardType='ascii-capable'
                                        autoCapitalize='none'
                                    />
                                </View>
                                <View style={styles.inputField}>
                                    <TextInput
                                        placeholder= "Email Address"
                                        placeholderTextColor="#aaa"
                                        style={styles.inputText}
                                        keyboardType='email-address'
                                        autoCapitalize='none'
                                    />
                                </View>
                                <View style={styles.inputField}>
                                    <TextInput
                                        placeholder= "Password"
                                        placeholderTextColor="#aaa"
                                        style={styles.inputText}
                                        secureTextEntry={true}
                                    />
                                </View>
                                <View style={styles.inputField}>
                                    <TextInput
                                        placeholder= "Confirm Password"
                                        placeholderTextColor="#aaa"
                                        style={styles.inputText}
                                        secureTextEntry={true}
                                    />
                                </View>
                                {/*TERMS AND CONDITIONS AND PRIVACY POLICY*/}
                                <View style={styles.termsContainer}>
                                    <TouchableOpacity
                                        onPress={() =>  setIsAgreed(!isAgreed)}
                                        style={[
                                            styles.checkbox,
                                            {backgroundColor: isAgreed ? '#00bb06' : '#fff', borderColor: isAgreed ? '#aaa' : '#aaa'},
                                        ]}>
                                        {isAgreed && <Text style={styles.checkbocTick}>✅</Text>}
                                    </TouchableOpacity>
                                    <Text style={styles.termsText}>
                                        By signing up you are agreeing to our{' '}
                                        <Text
                                            style={styles.linkText}
                                            /*ADD ON PRESS LINK TO TERMS AND CONDITIONS*/>
                                                Terms & Conditions
                                        </Text>{' '}
                                        and{' '}
                                        <Text
                                            style={styles.linkText}
                                            /*ADD ON PRESS LINK TO PRIVACY POLICY*/>
                                                Privacy Policy
                                        </Text>
                                    </Text>
                                </View>
                                {/*CONTINUE BUTTON
                                    - ONLY ACCSSIBLE IF: TERMS AND CONDITIOND AND PRIVACY POLICY IS AGREED WITH
                                */}
                                <TouchableOpacity style={styles.continueButton} onPress={() => navigation.navigate('Home')}>
                                    <Text style={[styles.continueButtonText, { color: isDarkMode ? '#000' : '#000' }]}>
                                        Continue
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