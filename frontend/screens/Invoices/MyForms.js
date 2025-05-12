import React, {useState} from 'react';
import {View, Text, TouchableOpacity, ImageBackground, StyleSheet, Image, TextInput, TouchableWithoutFeedback, Keyboard, ActivityIndicator, ScrollView } from 'react-native';
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
        marginBottom: 20,
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
        marginTop: 20,
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
        height: 480,
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
});

const MyForms = () => {
    const navigation = useNavigation();
    const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
    const dispatch = useAppDispatch();
    const [searchQuery, setSearchQuery] = useState('');
    
    // Get forms and auth state from Redux store
    const forms = useAppSelector(selectSortedForms);
    const loading = useAppSelector((state) => state.forms.loading);
    const error = useAppSelector((state) => state.forms.error);
    const authState = useAppSelector((state) => state.auth);

    // Check authentication on mount and when auth state changes
    React.useEffect(() => {
        if (!authState.isAuthenticated || !authState.accessToken) {
            navigation.replace('SignIn');
        }
    }, [authState.isAuthenticated, authState.accessToken]);

    const fetchAllForms = async () => {
        try {
            if (!authState.accessToken) {
                console.log('No auth token available, skipping forms fetch');
                return;
            }

            dispatch(setLoading(true));
            dispatch(setError(null));

            // Common headers for both requests
            const headers = {
                'Authorization': `Bearer ${authState.accessToken}`,
                'Content-Type': 'application/json'
            };

            console.log('Fetching forms with token:', authState.accessToken.substring(0, 10) + '...');

            // Fetch both types of forms in parallel with proper error handling
            const [invoiceResponse, jsaResponse] = await Promise.all([
                fetch(endpoints.getAllInvoiceForms, { headers }),
                fetch(endpoints.getAllJSAForms, { headers })
            ]);

            // Check responses and parse JSON
            let invoiceData = { data: [] };
            let jsaData = { data: [] };

            if (invoiceResponse.ok) {
                invoiceData = await invoiceResponse.json();
            } else {
                console.error('Invoice forms fetch failed:', await invoiceResponse.text());
            }

            if (jsaResponse.ok) {
                jsaData = await jsaResponse.json();
            } else {
                console.error('JSA forms fetch failed:', await jsaResponse.text());
            }

            // Only update the forms if at least one request was successful
            if (invoiceResponse.ok || jsaResponse.ok) {
                // Combine and mark the forms by type, ensuring proper structure
                const combinedForms = [
                    ...(invoiceData.data || []).map(form => ({
                        ...form,
                        formType: 'invoice'
                    })),
                    ...(jsaData.data || []).map(form => ({
                        ...form,
                        formType: 'jsa',
                        _typename: form._typename || 'JSA Form'
                    }))
                ];

                dispatch(setForms(combinedForms));
            } else {
                // If both requests failed, set error but keep existing forms
                throw new Error('Failed to fetch new forms');
            }
        } catch (err) {
            console.error('Error fetching forms:', err);
            dispatch(setError(err.message));
            // If the error is authentication related, you might want to redirect to login
            if (err.message.includes('authentication') || err.message.includes('token')) {
                navigation.navigate('SignIn');
            }
        } finally {
            dispatch(setLoading(false));
        }
    };

    // Use useFocusEffect to fetch forms every time the screen is focused
    useFocusEffect(
        React.useCallback(() => {
            fetchAllForms();
        }, []) // Empty dependency array as we want this to run every time the screen is focused
    );

    // Filter forms based on search query
    const filteredForms = forms.filter(form => {
        const searchLower = searchQuery.toLowerCase();
        const searchableText = form.formType === 'invoice'
            ? `${form.WorkTicketID || ''} ${form._typename || ''}`
            : `${form.CustomerName || ''} ${form._typename || ''}`;
        return searchableText.toLowerCase().includes(searchLower);
    });

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
                        {/* Activity Cards */}
                        <Card isDarkMode={isDarkMode} style={[{padding: 8}, styles.cardContainer]}>
                            <ScrollView 
                                style={styles.cardContent}
                                showsVerticalScrollIndicator={true}
                            >
                            {loading ? (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator size="large" color={isDarkMode ? '#fff' : '#000'} />
                                    <Text style={[styles.loadingText, { color: isDarkMode ? '#fff' : '#000' }]}>
                                        Loading forms...
                                    </Text>
                                </View>
                            ) : error ? (
                                <View style={styles.errorContainer}>
                                    <Text style={[styles.errorText, {color: isDarkMode ? '#fff' : '#000'}]}>
                                        There was an error getting your forms. Please check your internet connection. Error:{error}
                                    </Text>
                                </View>
                            ) : filteredForms.length === 0 ? (
                                <View style={styles.emptyContainer}>
                                    <Text style={[styles.emptyText, {color: isDarkMode ? '#fff' : '#000'}]}>
                                        No forms found
                                    </Text>
                                </View>
                            ) : (
                                filteredForms.map((form, index) => (
                                    <View key={index} style={[styles.activityCard, { backgroundColor: isDarkMode ? '#000' : '#fff', borderBottomColor: isDarkMode ? '#fff' : '#000'}]}>
                                        <View style={styles.activityDetails}>
                                            <Text style={[styles.activityText, {color: isDarkMode ? '#fff' : '#000'}]}>
                                                {form._typename || (form.formType === 'invoice' ? 'Invoice Form' : 'JSA Form')}
                                            </Text>
                                            <Text style={[styles.activityText, {fontSize: 12 }]}>
                                                {form.formType === 'invoice' 
                                                    ? `${form.InvoiceDate || 'No Date'} - ${form.WorkTicketID || 'No ID'}`
                                                    : `${form.FormDate || 'No Date'} - ${form.WorkTicketID || 'No ID'}`
                                                }
                                            </Text>
                                        </View>
                                        <TouchableOpacity onPress={() => {
                                            navigation.navigate('ViewForm', { 
                                                formData: {
                                                    ...form,
                                                    _typename: form.formType === 'invoice' ? 'Invoice Form' : 'JSA Form'
                                                }
                                            });
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