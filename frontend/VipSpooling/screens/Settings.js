import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, Image, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../store/themeSlice';
import { clearAuth } from '../store/authSlice';
import Card from '../components/Card';
import CustomBottomTab from '../components/CustomBottomTab';
import { Auth } from 'aws-amplify';

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
        color: 'red',
        marginLeft: 10,
    },
    logoutIcon: {
        width: 21,
        height: 21,
        tintColor: 'red',
    },
    logoutArrow: {
        width: 21,
        height: 21,
        tintColor: 'red',
    },
    cardIcon: {
        width: 25,
        height: 25,
    },
});

const Settings = () => {
    const navigation = useNavigation();
    const isDarkMode = useSelector((state) => state.theme.isDarkMode);
    const dispatch = useDispatch();
    const [pushNotifications, setPushNotifications] = useState(true);

    const backgroundImage = isDarkMode
        ? require('../assets/DarkMode.jpg')
        : require('../assets/LightMode.jpg');

    const handleLogout = async () => {
        try {
            // Sign out from AWS Cognito
            await Auth.signOut();
            
            // Clear Redux auth state
            dispatch(clearAuth());
            
            // Navigate to Welcome screen
            navigation.reset({
                index: 0,
                routes: [{ name: 'Welcome' }],
            });
        } catch (error) {
            console.error('Settings-handleLogout() => Error:', error);
            // Even if Cognito sign out fails, clear local state and navigate
            dispatch(clearAuth());
            navigation.reset({
                index: 0,
                routes: [{ name: 'Welcome' }],
            });
        }
    };

    return (
        <ImageBackground source={backgroundImage} style={styles.background}>
            <View style={styles.container}>
                
                {/* HEADER SECTION */}
                <View style={styles.header}>
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
                    <TouchableOpacity style={styles.editProfileButton} onPress={() => {navigation.navigate('EditProfile')}}>
                        <Text style={styles.editProfileText}>Edit Profile</Text>
                    </TouchableOpacity>
                </View>

                {/* PROFILE INFORMATION SECTION */}
                <Text style={[styles.sectionTitle, { color: isDarkMode ? '#fff' : '#000' }]}>Profile Information</Text>
                <Card isDarkMode={isDarkMode} style={styles.card}>
                    <View style={styles.row}>
                        <View style={styles.labelContainer}>
                            <Image source={require('../assets/admin.png')} style={[styles.cardIcon, { tintColor:  isDarkMode ? '#fff' : '#000'}]} />
                            <Text style={[styles.label, {color: isDarkMode ? '#fff' : '#000'}]}>Role:</Text>
                        </View>
                        <Text style={[styles.value, {color: isDarkMode ? '#fff' : '#000'}]}>Admin</Text>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.labelContainer}>
                            <Image source={require('../assets/id.png')} style={[styles.cardIcon, { tintColor: isDarkMode ? '#fff' : '#000'}]} />
                            <Text style={[styles.label, {color: isDarkMode ? '#fff' : '#000'}]}>Name:</Text>
                        </View>
                        <Text style={[styles.value, {color: isDarkMode ? '#fff' :'#000'}]}>Toby Green</Text>
                    </View>
                    <View style={styles.lastRow}>
                        <View style={styles.labelContainer}>
                            <Image source={require('../assets/mail2.png')} style={[styles.cardIcon, {tintColor: isDarkMode ? '#fff' : '#000'}]} />
                            <Text style={[styles.label, {color: isDarkMode ? '#fff' : '#000'}]}>Email:</Text>
                        </View>
                        <Text style={[styles.value, {color: isDarkMode ? '#fff' : '#000'}]}>toby.green@vipspooling.com</Text>
                    </View>
                </Card>

                {/* SUPPORT & NOTIFICATIONS SECTION */}
                <Card isDarkMode={isDarkMode} style={styles.card}>
                    <TouchableOpacity style={styles.row}>
                        <View style={styles.labelContainer}>
                            <Image source={require('../assets/support.png')} style={[styles.cardIcon, {tintColor: isDarkMode ? '#fff' : '#000'}]} />
                            <Text style={[styles.label, {color: isDarkMode ? '#fff' : '#000'}]}>Support</Text>
                        </View>
                        <Image source={require('../assets/right-arrow.png')} style={[styles.logoutIcon, { tintColor: isDarkMode ? '#fff' : '#000' }]} />
                    </TouchableOpacity>
                    <View style={styles.row}>
                        <View style={styles.labelContainer}>
                            <Image source={require('../assets/notifications.png')} style={[styles.cardIcon, {tintColor: isDarkMode ? '#fff' : '#000'}]} />
                            <Text style={[styles.label, {color: isDarkMode ? '#fff' : '#000'}]}>Push Notifications</Text>
                        </View>
                        <Switch
                            value={pushNotifications}
                            onValueChange={() => setPushNotifications(!pushNotifications)}
                            trackColor={{ false: '#ccc', true: '#3ec951' }}
                            thumbColor={pushNotifications ? '#fff' : '#f4f3f4'}
                            style={{ transform: [{ scaleX: 0.7}, {scaleY: 0.7}], left: 12}}
                        />
                    </View>
                    <TouchableOpacity style={styles.lastRow} onPress={handleLogout}>
                        <View style={styles.labelContainer}>
                            <Image source={require('../assets/logout.png')} style={styles.logoutIcon} />
                            <Text style={styles.logoutText}>Logout</Text>
                        </View>
                        <Image source={require('../assets/right-arrow.png')} style={styles.logoutArrow} />
                    </TouchableOpacity>
                </Card>
            </View>
            <CustomBottomTab/>
        </ImageBackground>
    );
};

export default Settings;
