import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Image, ActivityIndicator, ScrollView } from 'react-native';
import { useNavigation} from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../../store/themeSlice';
import Card from '../../components/Card';
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
        marginBottom: 90,
    },
    title: {
        fontSize: 30,
        fontWeight: '700',
        top: 40,
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
    cardContent: {
        width: '100%',
        height: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    templatesContainer: {
        flex: 1,
        width: '100%',
    },
    templatesContentContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: 1,
    },
    templateItem: {
        width: '48%',
        marginBottom: 5,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    templateImage: {
        width: '110%',
        height: 170,
        paddingTop: 2,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    templateInfo: {
        padding: 12,
    },
    templateName: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
        color: '#333',
        textAlign: 'center',
    },
    templateDate: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
    requestButton: {
        backgroundColor: '#FFD700',
        borderRadius: 12,  
        borderWidth: 1.3,
        borderColor: '#000',
        paddingVertical: 14, 
        paddingHorizontal: 20,
        alignItems: 'center',  
        justifyContent: 'center',
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
    requestButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '600',
    },
    buttonArrow: {
        height: 22,
        width: 22,
        marginLeft: 15,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 16,
        textAlign: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        textAlign: 'center',
    }
});

const getTemplateImage = (templateName) => {
    // Convert template name to lowercase for case-insensitive matching
    const name = templateName.toLowerCase();
    
    // Map template names to their corresponding images
    if (name.includes('jsa')) {
        return require('../../assets/JSAForm.jpg');
    } else if(name.includes('invoice')){
        return require('../../assets/InvoiceForm.jpg');
    } else {
        // Default image if no match is found
        return require('../../assets/noImage.jpg');
    }
};

const MyTemplates = () => {
    const navigation = useNavigation();
    const isDarkMode = useSelector((state) => state.theme.isDarkMode);
    const dispatch = useDispatch();
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const backgroundImage = isDarkMode
        ? require('../../assets/DarkMode.jpg')
        : require('../../assets/LightMode.jpg');

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const session = await Auth.currentSession();
            const accessToken = session.getAccessToken().getJwtToken();
            
            const response = await fetch(endpoints.templates, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch templates');
            }

            const data = await response.json();
            setTemplates(data.templates);
        } catch (err) {
            console.error('Error fetching templates:', err);
            setError('Failed to load templates. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleTemplatePress = (template) => {
        // Convert template name to lowercase for case-insensitive comparison
        const templateName = template.name.toLowerCase();
        
        if (templateName.includes('jsa')) {
            navigation.navigate('AddJsaForm');
        } else if (templateName.includes('invoice')) {
            navigation.navigate('AddInvoiceForm');
        } else {
            // Handle other template types here
            console.log('Selected template:', template);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return(
        <ImageBackground source={backgroundImage} style={styles.background}>
            <View style={styles.container}>
                {/*HEADER SECTION*/}
                <View style={styles.header}>
                    <Text style={[styles.title, {color: isDarkMode ? '#fff' : '#000'}]}>
                        Select A Template
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
                {/*CARD SECTION*/}
                <Card isDarkMode={isDarkMode} style={{ height: 550, justifyContent: 'center', backgroundColor: '#d5cfcf', borderColor: '#000'}}>
                    <View style={styles.cardContent}>
                        {loading ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color={isDarkMode ? '#fff' : '#000'} />
                                <Text style={[styles.formLabelText, { color: isDarkMode ? '#fff' : '#000' }]}>
                                    Loading templates...
                                </Text>
                            </View>
                        ) : error ? (
                            <View style={styles.errorContainer}>
                                <Text style={[styles.errorText, { color: isDarkMode ? '#fff' : '#000' }]}>
                                    {error}
                                </Text>
                            </View>
                        ) : templates.length === 0 ? (
                            <View style={styles.emptyContainer}>
                                <Text style={[styles.emptyText, { color: isDarkMode ? '#fff' : '#000' }]}>
                                    No templates available
                                </Text>
                            </View>
                        ) : (
                            <ScrollView 
                                style={styles.templatesContainer}
                                contentContainerStyle={styles.templatesContentContainer}
                                showsVerticalScrollIndicator={false}
                            >
                                {templates.map((template) => (
                                    <TouchableOpacity 
                                        key={template.id} 
                                        style={styles.templateItem}
                                        onPress={() => handleTemplatePress(template)}
                                    >
                                        <Image
                                            source={getTemplateImage(template.name)}
                                            style={styles.templateImage}
                                            resizeMode="contain"
                                        />
                                        <View style={styles.templateInfo}>
                                            <Text style={styles.templateName} numberOfLines={2}>
                                                {template.name}
                                            </Text>
                                            <Text style={styles.templateDate}>
                                                {formatDate(template.lastModified)}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        )}
                       
                        <TouchableOpacity style={styles.requestButton} onPress={() => {navigation.navigate('RequestTemplates')}}>
                            <Text style={styles.requestButtonText}>
                                Request a new template
                            </Text>
                            <Image
                                source={require('../../assets/right-arrow.png')}
                                style={styles.buttonArrow}
                            />
                        </TouchableOpacity>
                    </View>
                </Card>
            </View>
        </ImageBackground>
    );
};

export default MyTemplates;