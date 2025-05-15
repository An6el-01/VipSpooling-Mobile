import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ImageBackground, Image, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import { toggleTheme } from '../../../store/themeSlice';
import Card from '../../../components/Card';
import { Dropdown } from 'react-native-element-dropdown';
import { endpoints } from '../../../config/config';


const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
    },
    scrollContainer: {
        flexGrow: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerIcons: {
        flexDirection: 'row',
        alignItems: 'center',
        top: 30,
        marginBottom: 90,
    },
    headerIcon: {
        width: 24,
        height: 24,
        marginLeft: 15,
        marginBottom: 90,
    },
    title: {
        fontSize: 30,
        fontWeight: '700',
        top: 30,
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
        fontWeight: '600',
    },
    cardContainerContent: {
        justifyContent: 'center',
        width: '100%',
        paddingHorizontal: 1,
    },
    fieldText: {
        position: 'relative',
        marginBottom: 15,
        fontSize: 16,
        fontWeight: '600',
    },
    inputField: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 14,
        marginBottom: 22,
        width: '100%',
        borderWidth: 1.3,
        backgroundColor: '#EAE7E7',
    },
    inputText: {
        color: '#000',
        fontSize: 16,
        flex: 1,
    },
    dropdownContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 15,
        marginBottom: 22,
        width: '100%',
        borderWidth: 1.3,
        backgroundColor: '#EAE7E7',
    },
    dropdownStyle: {
        flex: 1,
        backgroundColor: '#EAE7E7',
        borderRadius: 8,
    },
    placeholderText: {
        fontSize: 16,
        color: '#5e5e5e',
    },
    selectedTextStyle: {
        fontSize: 16,
        color: '#000',
    },
    tagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 5,
    },
    tag: {
        backgroundColor: '#FFD700',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
        marginRight: 8,
        marginBottom: 8,
        flexDirection: 'row'
    },
    tagText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
    },
    removeTag: {
        marginLeft: 8,
        color: 'red',
        fontWeight: 'bold',
    },
   inviteButton: {
        backgroundColor: '#FFD700',
        borderRadius: 12,  // Rounded corners
        borderWidth: 1.3,
        borderColor: '#000',
        paddingVertical: 14,  // More padding for a modern look
        paddingHorizontal: 20,
        alignItems: 'center',  // Centers text inside the button
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        width: '100%',  // Adjust width to look more balanced
        alignSelf: 'center',  // Ensures button is centered
        marginTop: 20,
        shadowColor: '#000',  // Adds a slight shadow for depth
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3, 
},

    inviteButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '600',
    },
    buttonArrow: {
        height: 22,
        width: 22,
        marginLeft: 10,
    },
});

const NewTeamMember = () => {
    const navigation = useNavigation();
    const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
    const dispatch = useAppDispatch();
    const authState = useAppSelector((state) => state.auth);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [selectedRole, setSelectedRole] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const roles = [
        { label: 'Admin', value: 'Admin' },
        { label: 'Manager', value: 'Manager'},
        { label: 'Operator', value: 'Operator' },
    ];

    const backgroundImage = isDarkMode
        ? require('../../../assets/DarkMode.jpg')
        : require('../../../assets/LightMode.jpg');

    const handleCreateUser = async () => {
        try {
            if (!name || !email || !selectedRole) {
                setError('Please fill in all fields');
                return;
            }

            if (!email.includes('@')) {
                setError('Please enter a valid email address');
                return;
            }

            setLoading(true);
            setError('');

            console.log('Making request to:', endpoints.createUser);
            console.log('Request payload:', {
                name,
                email,
                role: selectedRole
            });

            const response = await fetch(endpoints.createUser, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authState.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    email,
                    role: selectedRole
                })
            });

            // Log the raw response
            const responseText = await response.text();
            console.log('Raw response:', responseText);

            let data;
            try {
                data = JSON.parse(responseText);
            } catch (parseError) {
                console.error('Failed to parse response:', responseText);
                throw new Error('Server returned an invalid response');
            }

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create user');
            }

            // Navigate to confirmation screen
            navigation.navigate('MemberInviteConfirmed', {
                email: email,
                name: name,
                role: selectedRole
            });
        } catch (err) {
            console.error('Error creating user:', err);
            setError(err.message);
            if (err.message.includes('authentication') || err.message.includes('token')) {
                navigation.navigate('SignIn');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <ImageBackground source={backgroundImage} style={styles.background}>
            <KeyboardAvoidingView style={{ flex: 1}} behavior="padding">
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1}}
                    keyboardShouldPersistTaps="handled"
                    bounces={false}
                >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.container}>
                            {/**HEADER SECTION*/}
                            <View style={styles.header}>
                                <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#000' }]}>
                                    New Team Member
                                </Text>
                                <TouchableOpacity
                                    style={styles.goBackButton}
                                    onPress={() => (navigation.goBack())}
                                >
                                    <Image
                                        source={require('../../../assets/arrowBack.png')}
                                        style={[styles.goBackIcon, { tintColor: isDarkMode ? '#fff' : '#000' }]}
                                    />
                                    <Text style={[styles.goBackText, { color: isDarkMode ? '#fff' : '#000' }]}>
                                        Go Back
                                    </Text>
                                </TouchableOpacity>
                                <View style={styles.headerIcons}>
                                    <TouchableOpacity onPress={() => dispatch(toggleTheme())}>
                                        <Image
                                            source={isDarkMode
                                                ? require('../../../assets/sun.png')
                                                : require('../../../assets/moon.png')
                                            }
                                            style={[styles.headerIcon, { tintColor: isDarkMode ? '#fff' : '#000' }]}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => { navigation.navigate('Settings') }}>
                                        <Image
                                            source={require('../../../assets/settings.png')}
                                            style={[styles.headerIcon, { tintColor: isDarkMode ? '#fff' : '#000' }]}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {/**FORM SECTION*/}
                            <Card isDarkMode={isDarkMode}>
                                <View style={styles.cardContainerContent}>
                                    {error ? (
                                        <Text style={{ color: 'red', marginBottom: 10, textAlign: 'center' }}>
                                            {error}
                                        </Text>
                                    ) : null}
                                    
                                    {/**Name Input Field*/}
                                    <Text style={[styles.fieldText, { color: isDarkMode ? '#fff' : '#000' }]}>Name</Text>
                                    <View style={[styles.inputField, { borderColor: isDarkMode ? '#fff' : '#000' }]}>
                                        <TextInput
                                            placeholder='Full Name'
                                            placeholderTextColor={isDarkMode ? '#5e5e5e' : '#aaa'}
                                            style={styles.inputText}
                                            value={name}
                                            onChangeText={setName}
                                            keyboardType="ascii-capable"
                                            autoCapitalize='words'
                                        />
                                    </View>
                                    
                                    {/**EMAIL INPUT FIELD*/}
                                    <Text style={[styles.fieldText, { color: isDarkMode ? '#fff' : '#000' }]}>User's Email</Text>
                                    <View style={[styles.inputField, { borderColor: isDarkMode ? '#fff' : '#000' }]}>
                                        <TextInput
                                            placeholder="Email Address"
                                            placeholderTextColor={isDarkMode ? '#5e5e5e' : '#aaa'}
                                            style={styles.inputText}
                                            value={email}
                                            onChangeText={setEmail}
                                            keyboardType='email-address'
                                            autoCapitalize='none'
                                        />
                                    </View>                                

                                    {/** Role Dropdown */}
                                    <Text style={[styles.fieldText, { color: isDarkMode ? '#fff' : '#000' }]}>Assign Role</Text>
                                    <View style={[styles.dropdownContainer, { borderColor: isDarkMode ? '#fff' : '#000' }]}>
                                        <Dropdown
                                            data={roles}
                                            labelField="label"
                                            valueField="value"
                                            placeholder='Select Role'
                                            value={selectedRole}
                                            onChange={item => setSelectedRole(item.value)}
                                            search={false}
                                            style={styles.dropdownStyle}
                                            placeholderStyle={[styles.placeholderText, {color: isDarkMode ? '#5e5e5e' : '#aaa'}]}
                                            selectedTextStyle={styles.selectedTextStyle}
                                        />
                                    </View>
                                    
                                    {/**BUTTON SECTION*/}
                                    <TouchableOpacity 
                                        style={[
                                            styles.inviteButton,
                                            { opacity: loading ? 0.7 : 1 }
                                        ]} 
                                        onPress={handleCreateUser}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <ActivityIndicator color="#000" />
                                        ) : (
                                            <>
                                                <Text style={styles.inviteButtonText}>
                                                    Send Invitation Code
                                                </Text>
                                                <Image
                                                    source={require('../../../assets/right-arrow.png')}
                                                    style={styles.buttonArrow}
                                                />
                                            </>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </Card>
                        </View>
                    </TouchableWithoutFeedback>
                </ScrollView>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
};

export default NewTeamMember;