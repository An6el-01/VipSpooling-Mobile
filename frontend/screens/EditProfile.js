import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, Image, Switch, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { toggleTheme } from '../store/themeSlice';
import { setUserAttributes } from '../store/authSlice';
import Card from '../components/Card';
import { endpoints } from '../config/config';

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
    },
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center', 
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: '100%',
        marginBottom: 20,
    },
    headerIcon: {
        width: 24,
        height: 24,
        top: 35,
    },
    profileContainer: {
        alignItems: 'center',
        marginBottom: 20,
        top: 20,
    },
    profileCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#FFD700',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        marginBottom: 10,
        borderWidth: 1.3,
        borderColor: '#000000',
    },
    profileIcon: {
        width: 80,
        height: 80,
        resizeMode: 'contain',
    },
    editProfileButton: {
        backgroundColor: '#FFD700',
        borderRadius: 12,  
        borderWidth: 1.3,
        borderColor: '#000',
        paddingVertical: 14,  
        paddingHorizontal: 25,
        alignItems: 'center',  
        justifyContent: 'center',
        width: '100%',  
        alignSelf: 'center',  
        shadowColor: '#000',  
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3, 
        marginBottom: 40,
    },
    editProfileText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 10,
        alignSelf: 'flex-start',
    },
    card: {
        width: '100%',
        borderRadius: 25,
        padding: 15,
        marginBottom: 15,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    lastRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1, // Makes sure text takes full width
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
        marginLeft: 10, // Adjusts spacing between icon and text
    },
    value: {
        fontSize: 14,
        fontWeight: '500',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 10,
        width: '100%',
    },
    logoutText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#B0AEAE',
        marginLeft: 10,
    },
    logoutIcon: {
        width: 21,
        height: 21,
        tintColor: '#B0AEAE',
    },
    logoutArrow: {
        width: 21,
        height: 21,
        tintColor: '#B0AEAE',
    },
    cardIcon: {
        width: 25,
        height: 25,
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
    input: {
        fontSize: 14,
        fontWeight: '500',
        width: 235,
        textAlign: 'right',
    }
});

const EditProfile = () => {
    const navigation = useNavigation();
    const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
    const authState = useAppSelector((state) => state.auth);
    const userAttributes = useAppSelector((state) => state.auth.userAttributes) || {};
    const userGroups = useAppSelector((state) => state.auth.userGroups) || [];
    const dispatch = useAppDispatch();
    
    const [role, setRole] = useState(userGroups[0] || '');
    const [name, setName] = useState(userAttributes.name || '');
    const [email, setEmail] = useState(userAttributes.email || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Check authentication on mount and when auth state changes
    React.useEffect(() => {
        if (!authState.isAuthenticated || !authState.accessToken) {
            navigation.replace('SignIn');
        }
    }, [authState.isAuthenticated, authState.accessToken]);

    // Initialize form with user data from Redux
    useEffect(() => {
        setRole(userGroups[0] || '');
        setName(userAttributes.name || '');
        setEmail(userAttributes.email || '');
    }, [userAttributes, userGroups]);

    const handleSaveChanges = async () => {
        try {
            if (!authState.accessToken) {
                throw new Error('No authentication token available');
            }

            setLoading(true);
            setError(null);

            // Make API call to update user attributes
            const response = await fetch(`${endpoints.users}/update`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${authState.accessToken}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    email,
                    // Only include role if user has permission to change it
                    ...(userGroups.includes('Admin') && { role })
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to update profile: ${response.status} ${errorText}`);
            }

            // Update Redux state with new values
            dispatch(setUserAttributes({
                name,
                email,
                role: userGroups[0] || 'User'
            }));

            // Navigate back to settings
            navigation.goBack();
        } catch (err) {
            console.error('Error updating profile:', err);
            setError(err.message);
            if (err.message.includes('authentication') || err.message.includes('token')) {
                navigation.navigate('SignIn');
            }
        } finally {
            setLoading(false);
        }
    };

    const backgroundImage = isDarkMode
        ? require('../assets/DarkMode.jpg')
        : require('../assets/LightMode.jpg');

    return (
        <ImageBackground source={backgroundImage} style={styles.background}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    {/* HEADER SECTION */}
                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.goBackButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Image
                                source={require('../assets/arrowBack.png')}
                                style={[styles.goBackIcon, {tintColor: isDarkMode ? '#fff' : '#000'}]}
                            />
                            <Text style={[styles.goBackText, { color: isDarkMode ? '#fff' : '#000'}]}> Go Back</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => dispatch(toggleTheme())}>
                            <Image
                                source={isDarkMode ? require('../assets/sun.png') : require('../assets/moon.png')}
                                style={[styles.headerIcon, { tintColor: isDarkMode ? '#fff' : '#000' }]}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* PROFILE SECTION */}
                    <View style={styles.profileContainer}>
                        <View style={styles.profileCircle}>
                            <Image source={require('../assets/manager.png')} style={[styles.profileIcon, {borderColor: isDarkMode ? '#fff' : '#000'}]} />
                        </View>
                        <TouchableOpacity style={styles.editProfileButton}>
                            <Text style={styles.editProfileText}>Change Picture</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Error Message */}
                    {error && (
                        <Text style={{ color: 'red', marginBottom: 10, textAlign: 'center' }}>
                            {error}
                        </Text>
                    )}

                    {/* PROFILE INFORMATION SECTION */}
                    <Text style={[styles.sectionTitle, { color: isDarkMode ? '#fff' : '#000' }]}>Profile Information</Text>
                    <Card isDarkMode={isDarkMode} style={styles.card}>
                        <View style={styles.row}>
                            <View style={styles.labelContainer}>
                                <Image source={require('../assets/admin.png')} style={[styles.cardIcon, { tintColor: isDarkMode ? '#fff' : '#000'}]} />
                                <Text style={[styles.label, {color: isDarkMode ? '#fff' : '#000'}]}>Role:</Text>
                            </View>
                            <TextInput
                                style={[styles.input, { color: isDarkMode ? '#fff' : '#000' }]}
                                value={role}
                                editable={false} // Role should not be editable by user
                            />
                        </View>
                        <View style={styles.row}>
                            <View style={styles.labelContainer}>
                                <Image source={require('../assets/id.png')} style={[styles.cardIcon, { tintColor: isDarkMode ? '#fff' : '#000'}]} />
                                <Text style={[styles.label, {color: isDarkMode ? '#fff' : '#000'}]}>Name:</Text>
                            </View>
                            <TextInput
                                style={[styles.input, { color: isDarkMode ? '#fff' : '#000'}]}
                                value={name}
                                onChangeText={setName}
                                placeholder="Enter your name"
                                placeholderTextColor={isDarkMode ? '#666' : '#999'}
                            />
                        </View>
                        <View style={styles.lastRow}>
                            <View style={styles.labelContainer}>
                                <Image source={require('../assets/mail2.png')} style={[styles.cardIcon, {tintColor: isDarkMode ? '#fff' : '#000'}]} />
                                <Text style={[styles.label, {color: isDarkMode ? '#fff' : '#000'}]}>Email:</Text>
                            </View>
                            <TextInput
                                style={[styles.input, { color: isDarkMode ? '#fff' : '#000' }]}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                placeholder="Enter your email"
                                placeholderTextColor={isDarkMode ? '#666' : '#999'}
                            />
                        </View>
                    </Card>

                    {/* Save Changes Button */}
                    <TouchableOpacity 
                        style={[styles.editProfileButton, loading && { opacity: 0.7 }]}
                        onPress={handleSaveChanges}
                        disabled={loading}
                    >
                        <Text style={styles.editProfileText}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </TouchableWithoutFeedback>
        </ImageBackground>
    );
};

export default EditProfile;
