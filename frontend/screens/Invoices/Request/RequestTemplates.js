import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Image, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector, useAppDispatch } from '../../../hooks/hooks';
import { toggleTheme } from '../../../store/themeSlice';
import Card from '../../../components/Card';

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
    },
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerIcons: {
        flexDirection: 'row',
        alignItems: 'center',
        top: 40,
    },  
    headerIcon: {
        width: 24,
        height: 24,
        marginLeft: 15,
        marginBottom: 90,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        top: 80,
    },
    goBackButton: {
        position: 'absolute',
        top: 40,
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
        fontWeight: '600'
    },
    cardContainerContent: {
        justifyContent: 'center',
    },
    fieldText: {
        position: 'relative',
        marginBottom: 15,
        fontSize: 16,
        fontWeight: '600',
    },
    inputField:{
        flexDirection: 'row',
        alignItems: 'center', // Centers content vertically by default
        backgroundColor: '#EAE7E7',
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 14,
        marginBottom: 22,
        width: '100%',
    },
    inputText: {
        color: '#000',
        fontSize: 16,
        flex: 1,
    },
    descriptionInputField: {
        height: 150, // Increased height for description input
        alignItems: 'flex-start', // Align text to the top
        textAlignVertical: 'top', // Align text to the top on Android
    },
    sendButton: {
        backgroundColor: '#FFD700',
        borderRadius: 12,  
        borderWidth: 1.3,
        borderColor: '#000',
        paddingVertical: 14, 
        paddingHorizontal: 40,
        alignItems: 'center',  
        flexDirection: 'row',
        width: '100%',  
        alignSelf: 'center',  
        marginTop: 20,
        shadowColor: '#000',  
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3, 
    },
    sendButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '600',
    },
    buttonArrow: {
        height: 22,
        width: 22,
        marginLeft: 15,
    }
});

const RequestTemplates = () => {
    const navigation = useNavigation();
    const isDarkMode = useAppSelector((state) =>  state.theme.isDarkMode);
    const dispatch = useAppDispatch(); 

    const backgroundImage = isDarkMode
    ? require('../../../assets/DarkMode.jpg')
    : require('../../../assets/LightMode.jpg') 

    return(
        <ImageBackground source={backgroundImage} style={styles.background}>
            <KeyboardAvoidingView behavior='padding' style={{ flex: 1 }}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.container}>
                        {/**HEADER SECTION*/}
                        <View style={styles.header}>
                            <Text style={[styles.title, {color: isDarkMode ? '#fff' : '#000'}]}>
                                Request A New Template
                            </Text>
                            <TouchableOpacity
                                style={styles.goBackButton}
                                onPress={() => {navigation.goBack()}}
                            >
                                <Image 
                                    source={require('../../../assets/arrowBack.png')} 
                                    style={[styles.goBackIcon, {tintColor: isDarkMode ? '#fff' : '#000'}]} 
                                />
                                <Text style={[styles.goBackText, { color: isDarkMode ? '#fff' : '#000'}]}>Go Back</Text>
                            </TouchableOpacity>
                            <View style={styles.headerIcons}>
                                <TouchableOpacity onPress={() => dispatch(toggleTheme())}>
                                    <Image
                                        source={isDarkMode 
                                        ? require('../../../assets/sun.png') 
                                        : require('../../../assets/moon.png')
                                    }
                                        style={[styles.headerIcon, { tintColor: isDarkMode ? '#fff' : '#000'}]}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {navigation.navigate('Settings')}}>
                                    <Image
                                        source={require('../../../assets/settings.png')}
                                        style={[styles.headerIcon, {tintColor: isDarkMode ? '#fff' : '#000' }]}
                                    />
                                </TouchableOpacity>
                            </View>  
                        </View>
                        {/**CARD SECTION*/}
                        <Card isDarkMode={isDarkMode} style={{marginTop: '80'}}>
                            <View style={styles.cardContainerContent}>
                                {/**NAME INPUT FIELD*/}
                                <Text style={[styles.fieldText, { color: isDarkMode ? '#fff' : '#000'}]}>Name</Text> 
                                <View style={[styles.inputField, { borderColor: isDarkMode ? '#fff' : '#000'}]}>
                                    <TextInput
                                        placeholder='Full Name'
                                        placeholderTextColor={isDarkMode ? '#5e5e5e' : '#aaa'}
                                        style={styles.inputText}
                                        keyboardType='ascii-capable'
                                        autoCapitalize='none'
                                    />
                                </View>
                                {/**EMAIL INPUT FIELD*/}
                                <Text style={[styles.fieldText, { color: isDarkMode ? '#fff' : '#000'}]}>Email</Text> 
                                <View style={[styles.inputField, { borderColor: isDarkMode ? '#fff' : '#000'}]}>
                                    <TextInput
                                        placeholder='Email Address'
                                        placeholderTextColor={isDarkMode ? '#5e5e5e' : '#aaa'}
                                        style={styles.inputText}
                                        keyboardType='ascii-capable'
                                        autoCapitalize='none'
                                    />
                                </View>
                                {/**DESCRIPTION INPUT FIELD*/}
                                <Text style={[styles.fieldText, { color: isDarkMode ? '#fff' : '#000'}]}>Description</Text> 
                                <View style={[styles.inputField, styles.descriptionInputField, { borderColor: isDarkMode ? '#fff' : '#000'}]}>
                                    <TextInput
                                        placeholder='Description'
                                        placeholderTextColor={isDarkMode ? '#5e5e5e' : '#aaa'}
                                        style={styles.inputText}
                                        keyboardType='ascii-capable'
                                        autoCapitalize='none'
                                        multiline={true} // Enable multiline input
                                        scrollEnabled={true} // Enable scrolling
                                    />
                                </View>
                                <TouchableOpacity style={styles.sendButton} onPress={() => {navigation.navigate('TRequestSentConfirmed')}}>
                                    <Text style={styles.sendButtonText}>Submit request</Text>
                                    <Image source={require('../../../assets/right-arrow.png')} style={styles.buttonArrow} />
                                </TouchableOpacity>
                            </View>
                        </Card>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
};

export default RequestTemplates;