import React, {useState, useMemo} from 'react';
import {View, Text, TouchableOpacity, ImageBackground, StyleSheet, Image, TextInput, TouchableWithoutFeedback, Keyboard, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useAppSelector, useAppDispatch } from '../../hooks/hooks';
import { toggleTheme } from '../../store/themeSlice';
import { setForms, setLoading, setError, selectSortedForms } from '../../store/formsSlice';
import Card from '../../components/Card';
import CustomBottomTab from '../../components/CustomBottomTab';
import { endpoints } from '../../config/config';
import { auth } from '../../services/auth';

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

const MyForms = () => {
    const navigation = useNavigation();
    const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
    const dispatch = useAppDispatch();
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const formsPerPage = 6;
    
    // Get forms and auth state from Redux store
    const forms = useAppSelector(selectSortedForms);
    const loading = useAppSelector((state) => state.forms.loading);
    const error = useAppSelector((state) => state.forms.error);
    const authState = useAppSelector((state) => state.auth);

    // Add these state variables at the top with other state declarations
    const [lastFetchTime, setLastFetchTime] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
    const MIN_FETCH_INTERVAL = 10 * 1000; // 10 seconds minimum between fetches

    // Check authentication on mount and when auth state changes
    React.useEffect(() => {
        if (!authState.isAuthenticated || !authState.accessToken) {
            navigation.replace('SignIn');
        }
    }, [authState.isAuthenticated, authState.accessToken]);

    const fetchAllForms = async (forceRefresh = false) => {
        try {
            if (!authState.accessToken) {
                console.log('No auth token available, skipping forms fetch');
                return;
            }

            // Check if we should skip the fetch based on cache and minimum interval
            const now = Date.now();
            if (!forceRefresh && lastFetchTime && 
                (now - lastFetchTime < MIN_FETCH_INTERVAL || 
                 (now - lastFetchTime < CACHE_DURATION && forms.length > 0))) {
                console.log('Using cached data, skipping fetch');
                return;
            }

            dispatch(setLoading(true));
            dispatch(setError(null));

            // Common headers for both requests
            const headers = {
                'Authorization': `Bearer ${authState.accessToken}`,
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            };

            console.log('Fetching forms with token:', authState.accessToken.substring(0, 10) + '...');

            // Enhanced fetch with retry logic and timeout
            const fetchWithRetry = async (url, retryCount = 0) => {
                const maxRetries = 3;
                const baseDelay = 1000; // 1 second
                const timeout = 30000; // 30 seconds timeout

                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), timeout);

                    const response = await fetch(url, { 
                        headers,
                        signal: controller.signal
                    });
                    
                    clearTimeout(timeoutId);

                    // Handle different HTTP status codes
                    switch (response.status) {
                        case 200:
                            return response;
                        case 429: // Too Many Requests
                            if (retryCount < maxRetries) {
                                const delay = baseDelay * Math.pow(2, retryCount);
                                console.log(`Rate limited. Retrying in ${delay}ms...`);
                                await new Promise(resolve => setTimeout(resolve, delay));
                                return fetchWithRetry(url, retryCount + 1);
                            }
                            throw new Error('Rate limit exceeded after retries');
                        case 401:
                            throw new Error('Authentication failed');
                        case 403:
                            throw new Error('Access forbidden');
                        case 404:
                            throw new Error('Resource not found');
                        case 500:
                            throw new Error('Server error');
                        default:
                            if (!response.ok) {
                                throw new Error(`HTTP error! status: ${response.status}`);
                            }
                    }
                } catch (error) {
                    if (error.name === 'AbortError') {
                        throw new Error('Request timeout');
                    }
                    
                    if (retryCount < maxRetries) {
                        const delay = baseDelay * Math.pow(2, retryCount);
                        console.log(`Request failed: ${error.message}. Retrying in ${delay}ms...`);
                        await new Promise(resolve => setTimeout(resolve, delay));
                        return fetchWithRetry(url, retryCount + 1);
                    }
                    throw error;
                }
            };

            // Fetch forms sequentially with individual error handling
            const fetchFormType = async (endpoint, formType) => {
                try {
                    const response = await fetchWithRetry(endpoint);
                    const data = await response.json();
                    
                    if (!data || !Array.isArray(data.data)) {
                        console.warn(`Invalid data format for ${formType} forms`);
                        return [];
                    }
                    
                    return data.data.map(form => ({
                        ...form,
                        formType,
                        _typename: form._typename || `${formType.charAt(0).toUpperCase() + formType.slice(1)} Form`
                    }));
                } catch (err) {
                    console.error(`${formType} forms fetch failed:`, err.message);
                    return [];
                }
            };

            // Fetch all form types
            const [invoiceForms, jsaForms, capillaryForms] = await Promise.all([
                fetchFormType(endpoints.getAllInvoiceForms, 'invoice'),
                fetchFormType(endpoints.getAllJSAForms, 'jsa'),
                fetchFormType(endpoints.getAllCapillaryForms, 'capillary')
            ]);

            // Combine all forms
            const combinedForms = [...invoiceForms, ...jsaForms, ...capillaryForms];

            if (combinedForms.length > 0) {
                dispatch(setForms(combinedForms));
                setLastFetchTime(now);
            } else if (forms.length === 0) {
                // Only show error if we have no existing forms
                throw new Error('No forms could be fetched');
            }

        } catch (err) {
            console.error('Error fetching forms:', err);
            
            // Handle specific error cases
            if (err.message.includes('Authentication failed')) {
                navigation.navigate('SignIn');
            } else if (err.message.includes('Rate limit exceeded')) {
                dispatch(setError('Too many requests. Please try again in a few minutes.'));
            } else if (err.message.includes('Request timeout')) {
                dispatch(setError('Request timed out. Please check your internet connection.'));
            } else {
                dispatch(setError(`Failed to fetch forms: ${err.message}`));
            }
        } finally {
            dispatch(setLoading(false));
        }
    };

    // Add pull-to-refresh functionality
    const handleRefresh = () => {
        fetchAllForms(true);
    };

    // Use useFocusEffect to fetch forms every time the screen is focused
    useFocusEffect(
        React.useCallback(() => {
            fetchAllForms();
        }, []) // Empty dependency array as we want this to run every time the screen is focused
    );

    // Memoize filtered forms to avoid unnecessary recalculations
    const filteredForms = useMemo(() => {
        return forms.filter(form => {
            const searchLower = searchQuery.toLowerCase();
            let searchableText = '';
            
            switch (form.formType) {
                case 'invoice':
                    searchableText = `${form.WorkTicketID || ''} ${form._typename || ''}`;
                    break;
                case 'jsa':
                    searchableText = `${form.CustomerName || ''} ${form._typename || ''}`;
                    break;
                case 'capillary':
                    searchableText = `${form.Customer || ''} ${form.WellName || ''} ${form._typename || ''}`;
                    break;
                default:
                    searchableText = form.WorkTicketID || '';
            }
            
            return searchableText.toLowerCase().includes(searchLower);
        });
    }, [forms, searchQuery]);

    // Calculate pagination values
    const totalPages = Math.ceil(filteredForms.length / formsPerPage);
    const startIndex = (currentPage - 1) * formsPerPage;
    const endIndex = startIndex + formsPerPage;
    const currentForms = filteredForms.slice(startIndex, endIndex);

    // Reset to first page when search query changes
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
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

    const backgroundImage = isDarkMode
    ? require('../../assets/DarkMode.jpg')
    : require('../../assets/LightMode.jpg')

    return(
        <ImageBackground source={backgroundImage} style={styles.background}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    {/* Header Section*/}
                    <View style={styles.header}>
                        <Text style={[styles.title, {color: isDarkMode ? '#fff' :'#000' }]}>
                            My Forms
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
                                    style={[styles.headerIcon, { tintColor: isDarkMode ? '#fff' : '#000' }]}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/*SEARCH BAR*/}
                    <View style={[
                        styles.searchContainer,
                        {
                            backgroundColor:  isDarkMode ? '#000' :'#fff',
                            borderColor:  isDarkMode ? '#fff' : '#000'
                        }
                    ]}>
                    
                        <Image
                            source={require('../../assets/searchIcon.png')}
                            style={[styles.searchIcon, { tintColor: isDarkMode ? '#fff' : '#000' }]}
                        />
                        <TextInput
                            placeholder='Search invoices...'
                            placeholderTextColor={isDarkMode ? '#aaa' : '#666'}
                            style={[styles.searchInput, { color: isDarkMode ? '#fff' : '#000'}]}
                            value={searchQuery}
                            onChangeText={(text) => setSearchQuery(text)}
                        />
                    </View>
                    <View style={styles.activitySection}>
                        {/* Pagination Controls */}
                        {renderPaginationControls()}
                        
                        <Card isDarkMode={isDarkMode} style={[{padding: 5}, styles.cardContainer]}>
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
                                    <Text style={[styles.errorText, {color: isDarkMode ? '#fff' : '#000'}]}>
                                        {error}
                                    </Text>
                                </View>
                            ) : filteredForms.length === 0 ? (
                                <View style={styles.emptyContainer}>
                                    <Text style={[styles.emptyText, {color: isDarkMode ? '#fff' : '#000'}]}>
                                        No forms found
                                    </Text>
                                </View>
                            ) : (
                                <>
                                    {currentForms.map((form, index) => (
                                        <View key={index} style={[styles.activityCard, { backgroundColor: isDarkMode ? '#000' : '#fff', borderBottomColor: isDarkMode ? '#fff' : '#000'}]}>
                                            <View style={styles.activityDetails}>
                                                <Text style={[styles.activityText, {color: isDarkMode ? '#fff' : '#000'}]}>
                                                    {(() => {
                                                        if (form.formType === 'invoice') {
                                                            return `${form.CableCompany || ''}, ${form.OilCompany || ''}, ${form.WorkTicketID || ''}`.trim() || form._typename;
                                                        } else if (form.formType === 'jsa') {
                                                            return `${form.CustomerName || ''}, ${form.Location || ''}, ${form.WorkTicketID || ''}`.trim() || form._typename;
                                                        } else if (form.formType === 'capillary') {
                                                            return `${form.Customer || ''}, ${form.WellName || ''}, ${form.WorkTicketID || ''}`.trim() || form._typename;
                                                        }
                                                        return form._typename;
                                                    })()}
                                                </Text>
                                                <Text style={[styles.activityText, {fontSize: 12 }]}>
                                                    {(() => {
                                                        if (form.formType === 'invoice') {
                                                            return `${form.Spooler || ''}, ${form.InvoiceDate || ''}`.trim() || 'No details available';
                                                        } else if (form.formType === 'jsa') {
                                                            return `${form.CreatedBy || ''}, ${form.EffectiveDate || ''}`.trim() || 'No details available';
                                                        } else if (form.formType === 'capillary') {
                                                            return `${form.TechnicianName || ''}, ${form.Date || ''}`.trim() || 'No details available';
                                                        }
                                                        return 'No details available';
                                                    })()}
                                                </Text>
                                            </View>
                                            <TouchableOpacity onPress={() => {
                                                navigation.navigate('ViewForm', { 
                                                    formData: {
                                                        ...form,
                                                        _typename: form.formType === 'invoice' ? 'Invoice Form' : form.formType === 'jsa' ? 'JSA Form' : 'Capillary Form'
                                                    }
                                                });
                                            }}>
                                                <Image
                                                    source={require('../../assets/view.png')}
                                                    style={[styles.activityIcon, { tintColor: isDarkMode ? '#fff' : '#000'}]}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                </>
                            )}
                            </ScrollView>
                        </Card>
                        {/*FLOATING ADD BUTTON*/}
                        <TouchableOpacity
                            onPress={() => (navigation.navigate('MyTemplates'))}
                            style={styles.fab}
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

export default MyForms;