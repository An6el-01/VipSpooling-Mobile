import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, Image, TextInput, TouchableWithoutFeedback, Keyboard, ActivityIndicator, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../../store/themeSlice';
import Card from '../../components/Card';
import CustomBottomTab from '../../components/CustomBottomTab';
import { Auth } from 'aws-amplify';
import { endpoints } from '../../config';

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
        marginBottom: 20,
    },
    headerIcons: {
        flexDirection: 'row',
        alignItems: 'center',
        top: 40,
        marginBottom: 90,
    },
    headerIcon: {
        width: 24,
        height: 24,
        marginLeft: 15,
    },
    title: {
        fontSize: 30,
        fontWeight: '700',
        color: '#000',
        marginBottom: 20,
        top: 40,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderWidth: 1.3,
        borderColor: '#ccc',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1,},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#000',
    },
    searchIcon: {
        width: 20,
        height: 20,
        tintColor: '#000',
        marginLeft: 5,
        marginRight: 20,
    },
    activitySection: {
        marginTop: 20
    },
    cardContainer: {
        height: 480,
    },
    cardContent: {
        flex: 1,
    },
    activityCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderRadius:  10,
        padding: 10,
        marginBottom: 10,
        borderColor: '#ccc'
    },
    activityDetails: {
        flexDirection: 'column',
        marginRight: 25,
    },
    activityText: {
        fontSize: 15,
        width: '220',
        fontWeight: '700',
        color: '#838383',
        marginBottom: 5,
    },
    activityIcon: {
        width: 30,
        height: 30,
        tintColor: '#000',
    },
    fab: {
        position: 'absolute',
        backgroundColor: '#2196F3',
        bottom: -20,
        right: -16,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 6,
    },
    fabIcon: {
        width: 30,
        height: 30,
        tintColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        textAlign: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        textAlign: 'center',
    },
});

const MyTeam = () => {
    const navigation = useNavigation();
    const isDarkMode = useSelector((state) => state.theme.isDarkMode);
    const dispatch = useDispatch();
    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const backgroundImage = isDarkMode
        ? require('../../assets/DarkMode.jpg')
        : require('../../assets/LightMode.jpg');

    useEffect(() => {
        fetchUsers();
    }, []);
/**
 * This function fetches users from the backend using the API endpoint  
 * and updates the users state with the fetched data.
 * It also handles loading and error states.
 */
    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Get the current authenticated user's session
            const session = await Auth.currentSession();
            const accessToken = session.getAccessToken().getJwtToken();
            
            // Make an API call to your backend to get users
            const response = await fetch(endpoints.users, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }

            const data = await response.json();
            setUsers(data.users);
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Failed to load users. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(user => 
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return(
        <ImageBackground source={backgroundImage} style={styles.background}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    {/*Header Section*/}
                    <View style={styles.header}>
                        <Text style={[styles.title, {color: isDarkMode ? '#fff' : '#000'}]}>
                            My Team
                        </Text>
                        <View style={styles.headerIcons}>
                            <TouchableOpacity onPress={() => dispatch(toggleTheme())}>
                                <Image
                                    source={
                                        isDarkMode
                                            ? require('../../assets/sun.png')
                                            : require('../../assets/moon.png')
                                    }
                                    style={[styles.headerIcon, { tintColor: isDarkMode ? '#fff' : '#000'}]}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {navigation.navigate('Settings')}}>
                                <Image
                                    source={require('../../assets/settings.png')}
                                    style={[styles.headerIcon, { tintColor: isDarkMode ? '#fff' : '#000'}]}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/*SEARCH BAR*/}
                    <View style={[
                        styles.searchContainer,
                        {
                            backgroundColor: isDarkMode ? '#000' : '#fff',
                            borderColor: isDarkMode ? '#fff' : '#000'
                        }
                    ]}>
                        <Image
                            source={require('../../assets/searchIcon.png')}
                            style={[styles.searchIcon, {tintColor: isDarkMode ? '#fff' : '#000'}]}
                        />
                        <TextInput
                            placeholder="Search..."
                            placeholderTextColor={isDarkMode ? '#aaa' : '#666'}
                            style={[styles.searchInput, { color: isDarkMode ? '#fff' : '#000'}]}
                            value={searchQuery}
                            onChangeText={(text) => setSearchQuery(text)}
                        />
                    </View>
                    {/*MY TEAM SECTION*/}
                    <View style={styles.activitySection}>
                        <Card isDarkMode={isDarkMode} style={[{padding: 8}, styles.cardContainer]}>
                            <ScrollView 
                                style={styles.cardContent}
                                showsVerticalScrollIndicator={true}
                            >
                            {loading ? (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator size="large" color={isDarkMode ? '#fff' : '#000'} />
                                    <Text style={[styles.loadingText, { color: isDarkMode ? '#fff' : '#000' }]}>
                                        Loading users...
                                    </Text>
                                </View>
                            ) : error ? (
                                <View style={styles.errorContainer}>
                                    <Text style={[styles.errorText, { color: isDarkMode ? '#fff' : '#000' }]}>
                                        {error}
                                    </Text>
                                </View>
                            ) : filteredUsers.length === 0 ? (
                                <View style={styles.emptyContainer}>
                                    <Text style={[styles.emptyText, { color: isDarkMode ? '#fff' : '#000' }]}>
                                        No users found
                                    </Text>
                                </View>
                            ) : (
                                filteredUsers.map((user, index) => (
                                    <View key={index} style={[styles.activityCard, { backgroundColor: isDarkMode ? '#000' : '#fff', borderBottomColor: isDarkMode ? '#fff' : '#000'}]}>
                                        <View style={styles.activityDetails}>
                                            <Text style={[styles.activityText, { color: isDarkMode ? '#fff' : '#000'}]}>
                                                {user.name || 'Unnamed User'}
                                            </Text>
                                            <Text style={[styles.activityText, {fontSize: 12}]}>
                                                Roles: {user.groups?.join(', ') || 'No roles'}
                                            </Text>
                                        </View>
                                        <TouchableOpacity onPress={() => {
                                            navigation.navigate('EditTeamMember', { 
                                                user: {
                                                    name: user.name,
                                                    email: user.email,
                                                    groups: user.groups
                                                }
                                            })
                                        }}>
                                            <Image
                                                source={require('../../assets/view.png')}
                                                style={[styles.activityIcon, { tintColor: isDarkMode ? '#fff' : '#000'}]}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                ))
                            )}
                            </ScrollView>
                        </Card>
                        {/*FLOATING ADD BUTTON*/}
                        <TouchableOpacity
                            style={styles.fab}
                            onPress={() => navigation.navigate('NewTeamMember')}
                        >
                            <Image
                                source={require('../../assets/plus.png')}
                                style={styles.fabIcon}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
            <CustomBottomTab/>
        </ImageBackground>
    );
};

export default MyTeam;