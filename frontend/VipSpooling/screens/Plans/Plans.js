import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Image, ActivityIndicator, ScrollView } from 'react-native';
import { useNavigation} from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../../store/themeSlice';
import CustomBottomTab from '../../components/CustomBottomTab';
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
        marginBottom: 40,
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
    cardContent: {
        width: '100%',
        height: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    plansContainer: {
        flex: 1,
        width: '110%',
    },
    plansContentContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: 1,
    },
    planItem: {
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
    planImage: {
        width: '110%',
        height: 170,
        paddingTop: 2,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    planInfo: {
        padding: 12,
    },
    planName: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
        color: '#333',
        textAlign: 'center',
    },
    planDate: {
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

const getPlanImage = (planName) => {
    // Convert plan name to lowercase for case-insensitive matching
    const name = planName.toLowerCase();
    
    // Map plan names to their corresponding images
    if (name.includes('pricing')) {
        return require('../../assets/PricingTerms2022.jpg');
    } else {
        // Default image if no match is found
        return require('../../assets/noImage.jpg');
    }
};

const Plans = () => {
    const navigation = useNavigation();
    const isDarkMode = useSelector((state) => state.theme.isDarkMode);
    const dispatch = useDispatch();
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const backgroundImage = isDarkMode
        ? require('../../assets/DarkMode.jpg')
        : require('../../assets/LightMode.jpg');

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const session = await Auth.currentSession();
            const accessToken = session.getAccessToken().getJwtToken();
            
            console.log('Fetching plans from:', endpoints.pricingplans);
            console.log('Using access token:', accessToken.substring(0, 20) + '...');
            
            const response = await fetch(endpoints.pricingplans, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error(`Failed to fetch pricing plans: ${response.status} ${errorText}`);
            }

            const data = await response.json();
            console.log('Received plans data:', data);
            setPlans(data.pricingPlans);
        } catch (err) {
            console.error('Detailed error fetching pricing plans:', err);
            setError(`Failed to load pricing plans: ${err.message}`);
        } finally {
            setLoading(false);
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
                        Pricing Plans
                    </Text>
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
                                style={[styles.headerIcon, {tintColor: isDarkMode ? '#fff' : '#000'}]}
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
                                <Text style={[styles.planName, { color: isDarkMode ? '#fff' : '#000' }]}>
                                    Loading pricing plans...
                                </Text>
                            </View>
                        ) : error ? (
                            <View style={styles.errorContainer}>
                                <Text style={[styles.errorText, { color: isDarkMode ? '#fff' : '#000' }]}>
                                    {error}
                                </Text>
                            </View>
                        ) : plans.length === 0 ? (
                            <View style={styles.emptyContainer}>
                                <Text style={[styles.emptyText, { color: isDarkMode ? '#fff' : '#000' }]}>
                                    No pricing plans available
                                </Text>
                            </View>
                        ) : (
                            <ScrollView 
                                style={styles.plansContainer}
                                contentContainerStyle={styles.plansContentContainer}
                                showsVerticalScrollIndicator={false}
                            >
                                {plans.map((plan) => (
                                    <TouchableOpacity 
                                        key={plan.id} 
                                        style={styles.planItem}
                                        onPress={() => {
                                            // Handle plan selection
                                            console.log('Selected plan:', plan);
                                        }}
                                    >
                                        <Image
                                            source={getPlanImage(plan.name)}
                                            style={styles.planImage}
                                            resizeMode="contain"
                                        />
                                        <View style={styles.planInfo}>
                                            <Text style={styles.planName} numberOfLines={2}>
                                                {plan.name}
                                            </Text>
                                            <Text style={styles.planDate}>
                                                {formatDate(plan.lastModified)}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        )}
                       
                        <TouchableOpacity style={styles.requestButton} onPress={() => {navigation.navigate('RequestPlan')}}>
                            <Text style={styles.requestButtonText}>
                                Request a new pricing plan
                            </Text>
                            <Image
                                source={require('../../assets/right-arrow.png')}
                                style={styles.buttonArrow}
                            />
                        </TouchableOpacity>
                    </View>
                </Card>
            </View>
            <CustomBottomTab/>
        </ImageBackground>
    );
};

export default Plans;