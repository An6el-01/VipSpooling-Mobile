import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, Image, TextInput, TouchableWithoutFeedback, Keyboard, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useAppSelector, useAppDispatch } from '../../hooks/hooks';
import { toggleTheme } from '../../store/themeSlice';
import Card from '../../components/Card';
import CustomBottomTab from '../../components/CustomBottomTab';
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
        marginBottom: 20,
    },
    headerIcons: {
        flexDirection: 'row',
        alignItems: 'center',
        top: 40,
        marginBottom: 90,
    },
    headerIcon: {
        width:24,
        height: 24,
        marginLeft: 15,
    },
    title: {
        fontSize:30,
        fontWeight: '700',
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
        marginBottom: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1},
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
        marginRight: 20
    },
    activitySection: {
        marginTop: 15,
    },
    activityCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        borderColor: '#ccc'
    },
    activityDetails:{
        flexDirection: 'column',
        marginRight: 25,
    },
    activityText: {
        fontSize: 12,
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
        right: -17,
        width: 50,
        height: 50,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {Width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 6,
    },
    fabIcon: {
        width: 30,
        height: 30,
        tintColor: '#fff',
    },
    cardContainer: {
        height: 450,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
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
    cardContent: {
        flex: 1,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: '700',
        color: '#838383',
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 5,
        marginBottom: 15,
        backgroundColor: 'transparent',
    },
    paginationButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginHorizontal: 3,
        borderRadius: 10,
        backgroundColor: '#fff',
        borderWidth: 1.3,
        borderColor: '#ccc',
        minWidth: 45,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    paginationButtonActive: {
        backgroundColor: '#2196F3',
        borderColor: '#2196F3',
        shadowColor: '#2196F3',
        shadowOpacity: 0.2,
    },
    paginationButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
    },
    paginationButtonTextActive: {
        color: '#fff',
    },
    paginationInfo: {
        fontSize: 14,
        marginHorizontal: 10,
        color: '#666',
    },
});

const MyTeam = () => {
    const navigation = useNavigation();
    const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
    const dispatch = useAppDispatch();
    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const authState = useAppSelector((state) => state.auth);
    const userGroups = useAppSelector((state) => state.auth.userGroups) || [];
    const isOperator = userGroups.includes('Operator');
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 6;
    const [lastFetchTime, setLastFetchTime] = useState(null);
    const MIN_FETCH_INTERVAL = 10000; // 10 seconds
    const CACHE_DURATION = 60000; // 1 minute

    const backgroundImage = isDarkMode
        ? require('../../assets/DarkMode.jpg')
        : require('../../assets/LightMode.jpg');

    // Check authentication on mount and when auth state changes
    React.useEffect(() => {
        if (!authState.isAuthenticated || !authState.accessToken) {
            navigation.replace('SignIn');
        }
    }, [authState.isAuthenticated, authState.accessToken]);

    // Use useFocusEffect to fetch users every time the screen is focused
    useFocusEffect(
        React.useCallback(() => {
            if (authState.accessToken) {
                fetchUsers();
            }
        }, [authState.accessToken])
    );

    const fetchUsers = async (forceRefresh = false) => {
        try {
            if (!authState.accessToken) {
                console.log('No auth token available, skipping users fetch');
                return;
            }

            // Check if we should skip the fetch based on cache and minimum interval
            const now = Date.now();
            if (!forceRefresh && lastFetchTime && 
                (now - lastFetchTime < MIN_FETCH_INTERVAL || 
                 (now - lastFetchTime < CACHE_DURATION && users.length > 0))) {
                console.log('Using cached data, skipping fetch');
                return;
            }

            setLoading(true);
            setError(null);

            console.log('Fetching users with token:', authState.accessToken.substring(0, 10) + '...');
            
            // Make an API call to your backend to get users
            const response = await fetch(endpoints.users, {
                headers: {
                    'Authorization': `Bearer ${authState.accessToken}`,
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }

            const data = await response.json();
            console.log('Users fetched successfully:', data.users.length);
            setUsers(data.users);
            setLastFetchTime(now);
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Failed to load users. Please try again later.');
            if (err.message.includes('authentication') || err.message.includes('token')) {
                navigation.navigate('SignIn');
            }
        } finally {
            setLoading(false);
        }
    };

    // Memoize filtered users to avoid unnecessary recalculations
    const filteredUsers = useMemo(() => {
        return users.filter(user => 
            user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [users, searchQuery]);

    // Calculate pagination values
    const totalPages = Math.max(1, Math.ceil(filteredUsers.length / usersPerPage));
    const startIndex = (currentPage - 1) * usersPerPage;
    const endIndex = startIndex + usersPerPage;
    const currentUsers = filteredUsers.slice(startIndex, endIndex);

    // Reset to first page when search query changes
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Add pull-to-refresh functionality
    const handleRefresh = () => {
        fetchUsers(true);
    };

    const renderPaginationControls = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return (
            <View style={[
                styles.paginationContainer,
                { backgroundColor: isDarkMode ? 'transparent' : 'transparent' }
            ]}>
                <TouchableOpacity
                    style={[
                        styles.paginationButton,
                        { backgroundColor: isDarkMode ? '#000' : '#fff', borderColor: isDarkMode ? '#fff' : '#ccc' },
                        currentPage === 1 && { opacity: 0.5 }
                    ]}
                    onPress={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                >
                    <Text style={[styles.paginationButtonText, { color: isDarkMode ? '#fff' : '#000' }]}>First</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.paginationButton,
                        { backgroundColor: isDarkMode ? '#000' : '#fff', borderColor: isDarkMode ? '#fff' : '#ccc' },
                        currentPage === 1 && { opacity: 0.5 }
                    ]}
                    onPress={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <Text style={[styles.paginationButtonText, { color: isDarkMode ? '#fff' : '#000' }]}>‹</Text>
                </TouchableOpacity>

                {pageNumbers.map(number => (
                    <TouchableOpacity
                        key={number}
                        style={[
                            styles.paginationButton,
                            { backgroundColor: isDarkMode ? '#000' : '#fff', borderColor: isDarkMode ? '#fff' : '#ccc' },
                            currentPage === number && styles.paginationButtonActive
                        ]}
                        onPress={() => handlePageChange(number)}
                    >
                        <Text style={[
                            styles.paginationButtonText,
                            { color: isDarkMode ? '#fff' : '#000' },
                            currentPage === number && styles.paginationButtonTextActive
                        ]}>
                            {number}
                        </Text>
                    </TouchableOpacity>
                ))}

                <TouchableOpacity
                    style={[
                        styles.paginationButton,
                        { backgroundColor: isDarkMode ? '#000' : '#fff', borderColor: isDarkMode ? '#fff' : '#ccc' },
                        currentPage === totalPages && { opacity: 0.5 }
                    ]}
                    onPress={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <Text style={[styles.paginationButtonText, { color: isDarkMode ? '#fff' : '#000' }]}>›</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.paginationButton,
                        { backgroundColor: isDarkMode ? '#000' : '#fff', borderColor: isDarkMode ? '#fff' : '#ccc' },
                        currentPage === totalPages && { opacity: 0.5 }
                    ]}
                    onPress={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                >
                    <Text style={[styles.paginationButtonText, { color: isDarkMode ? '#fff' : '#000' }]}>Last</Text>
                </TouchableOpacity>
            </View>
        );
    };

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
                        {/* Pagination Controls */}
                        {renderPaginationControls()}
                        
                        <Card isDarkMode={isDarkMode} style={[{padding: 8}, styles.cardContainer]}>
                            <ScrollView 
                                style={styles.cardContent}
                                showsVerticalScrollIndicator={true}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={loading}
                                        onRefresh={handleRefresh}
                                        colors={[isDarkMode ? '#fff' : '#000']}
                                        tintColor={isDarkMode ? '#fff' : '#000'}
                                    />
                                }
                            >
                            {error ? (
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
                                currentUsers.map((user, index) => (
                                    <View key={index} style={[styles.activityCard, { backgroundColor: isDarkMode ? '#000' : '#fff', borderBottomColor: isDarkMode ? '#fff' : '#000'}]}>
                                        <View style={styles.activityDetails}>
                                            <Text style={[styles.activityText, { color: isDarkMode ? '#fff' : '#000'}]}>
                                                {user.name || 'Unnamed User'}
                                            </Text>
                                            <Text style={[styles.activityText, {fontSize: 12}]}>
                                                Roles: {user.groups?.join(', ') || 'No roles'}
                                            </Text>
                                        </View>
                                        {!isOperator && (
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
                                        )}
                                    </View>
                                ))
                            )}
                            </ScrollView>
                        </Card>
                        {/*FLOATING ADD BUTTON - Only show for non-operators*/}
                        {!isOperator && (
                            <TouchableOpacity
                                style={styles.fab}
                                onPress={() => navigation.navigate('NewTeamMember')}
                            >
                                <Image
                                    source={require('../../assets/plus.png')}
                                    style={styles.fabIcon}
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </TouchableWithoutFeedback>
            <CustomBottomTab/>
        </ImageBackground>
    );
};

export default MyTeam;