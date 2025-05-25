import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Image, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector, useAppDispatch } from '../../hooks/hooks';
import { toggleTheme } from '../../store/themeSlice';
import Card from '../../components/Card';
import { endpoints } from '../../config/config';

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
        fontSize: 20,
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

const RequestPlan = () => {
    const navigation = useNavigation();
    const isDarkMode = useAppSelector((state) =>  state.theme.isDarkMode);
    const dispatch = useAppDispatch();
    const authState = useAppSelector((state) => state.auth);
    const userAttributes = useAppSelector((state) => state.auth.userAttributes) || {};

    // Add state for form inputs
    const [formData, setFormData] = useState({
        name: 'Plans', // Default template type
        email: userAttributes.email || '', // Initialize with email from userAttributes
        description: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    // Effect to fetch user data if not available
    useEffect(() => {
        const fetchUserEmail = async () => {
            try {
                if (!authState.accessToken) {
                    console.log('No auth token available');
                    return;
                }

                const response = await fetch(endpoints.users, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${authState.accessToken}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }

                const data = await response.json();
                const currentUser = data.users.find(u => u.email === userAttributes.email);
                
                if (currentUser) {
                    setFormData(prev => ({
                        ...prev,
                        email: currentUser.email
                    }));
                }
            } catch (error) {
                console.error('Error fetching user email:', error);
            }
        };

        if (!formData.email && authState.accessToken) {
            fetchUserEmail();
        }
    }, [authState.accessToken, userAttributes.email]);

    const handleSubmit = async () => {
        // Basic validation
        if (!formData.description) {
            Alert.alert('Error', 'Please enter a description for your request');
            return;
        }

        setIsLoading(true);

        try {
            console.log('Sending request with data:', {
                to_name: formData.name,
                to_email: formData.email,
                formType: 'Plans',
                formSpecs: formData.description
            });
            
            const response = await fetch(endpoints.sendRequestTemplate, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    to_name: formData.name,
                    to_email: formData.email,
                    from_name: 'Custom GoFormz',
                    formType: 'Plans',
                    formSpecs: formData.description,
                    reply_to: 'support@customgoformz.com'
                })
            });

            // First try to get the response as text
            const responseText = await response.text();
            
            let data;
            try {
                // Try to parse the response text as JSON
                data = JSON.parse(responseText);
            } catch (parseError) {
                console.error('Response is not JSON:', responseText);
                throw new Error('Invalid server response format');
            }

            if (response.ok && data.success) {
                // Clear the description field after successful submission
                setFormData(prev => ({ ...prev, description: '' }));
                navigation.navigate('RequestSentConfirmed');
            } else {
                throw new Error(data.message || 'Failed to send request');
            }
        } catch (error) {
            console.error('Error sending request:', error);
            Alert.alert(
                'Error',
                error.message || 'Failed to send request. Please try again later.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const backgroundImage = isDarkMode
    ? require('../../assets/DarkMode.jpg')
    : require('../../assets/LightMode.jpg') 

    return(
        <ImageBackground source={backgroundImage} style={styles.background}>
            <KeyboardAvoidingView behavior='padding' style={{ flex: 1 }}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.container}>
                        {/**HEADER SECTION*/}
                        <View style={styles.header}>
                            <Text style={[styles.title, {color: isDarkMode ? '#fff' : '#000'}]}>
                                Request A New Pricing Plan
                            </Text>
                            <TouchableOpacity
                                style={styles.goBackButton}
                                onPress={() => {navigation.goBack()}}
                            >
                                <Image 
                                    source={require('../../assets/arrowBack.png')} 
                                    style={[styles.goBackIcon, {tintColor: isDarkMode ? '#fff' : '#000'}]} 
                                />
                                <Text style={[styles.goBackText, { color: isDarkMode ? '#fff' : '#000'}]}>Go Back</Text>
                            </TouchableOpacity>
                            <View style={styles.headerIcons}>
                                <TouchableOpacity onPress={() => dispatch(toggleTheme())}>
                                    <Image
                                        source={isDarkMode 
                                        ? require('../../assets/sun.png') 
                                        : require('../../assets/moon.png')
                                    }
                                        style={[styles.headerIcon, { tintColor: isDarkMode ? '#fff' : '#000'}]}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {navigation.navigate('Settings')}}>
                                    <Image
                                        source={require('../../assets/settings.png')}
                                        style={[styles.headerIcon, {tintColor: isDarkMode ? '#fff' : '#000' }]}
                                    />
                                </TouchableOpacity>
                            </View>  
                        </View>
                        {/**CARD SECTION*/}
                        <Card isDarkMode={isDarkMode} style={{marginTop: '80'}}>
                            <View style={styles.cardContainerContent}>
                                {/**TEMPLATE TYPE FIELD*/}
                                <Text style={[styles.fieldText, { color: isDarkMode ? '#fff' : '#000'}]}>Template Type:</Text> 
                                <View style={[styles.inputField, { borderColor: isDarkMode ? '#fff' : '#000'}]}>
                                    <TextInput
                                        placeholder='Template Type'
                                        placeholderTextColor={isDarkMode ? '#5e5e5e' : '#aaa'}
                                        style={styles.inputText}
                                        editable={false}
                                        value="Plans"
                                    />
                                </View>
                                {/**EMAIL INPUT FIELD*/}
                                <Text style={[styles.fieldText, { color: isDarkMode ? '#fff' : '#000'}]}>Email:</Text> 
                                <View style={[styles.inputField, { borderColor: isDarkMode ? '#fff' : '#000'}]}>
                                    <TextInput
                                        placeholder='Email Address'
                                        placeholderTextColor={isDarkMode ? '#5e5e5e' : '#aaa'}
                                        style={styles.inputText}
                                        keyboardType='email-address'
                                        autoCapitalize='none'
                                        value={formData.email}
                                        onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                                        editable={false} // Make email field non-editable
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
                                        multiline={true}
                                        scrollEnabled={true}
                                        value={formData.description}
                                        onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
                                    />
                                </View>
                                <TouchableOpacity 
                                    style={[
                                        styles.sendButton,
                                        isLoading && { opacity: 0.7 }
                                    ]} 
                                    onPress={handleSubmit}
                                    disabled={isLoading}
                                >
                                    <Text style={styles.sendButtonText}>
                                        {isLoading ? 'Sending...' : 'Submit request'}
                                    </Text>
                                    <Image source={require('../../assets/right-arrow.png')} style={styles.buttonArrow} />
                                </TouchableOpacity>
                            </View>
                        </Card>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
};

export default RequestPlan;