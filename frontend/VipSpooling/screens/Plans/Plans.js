import React from 'react';
import {View, Text, TouchableOpacity, ImageBackground, StyleSheet, Image} from 'react-native';
import { useNavigation} from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../../store/themeSlice';
import CustomBottomTab from '../../components/CustomBottomTab';
import Card from '../../components/Card';

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
    },
    cardContent:{
        width: '100%',
        height: '100%',
        justifyContent: 'space-between',
    },
    cardImage: {
        width: 150,
        height: 150,
        resizeMode: 'contain',
    },
    plan: {
        flexDirection: 'column',
    },
    planLabelText: {
        textAlign: 'center',
        marginTop: 10,
    },
    requestButton: {
        backgroundColor: '#FFD700',
        padding: 10,
        borderRadius: 10,
        borderWidth: 1.3,
        flexDirection: 'row',
        borderColor: '#000',
        justifyContent: 'center',
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
})

const Plans = () => {
    const navigation = useNavigation();
    const isDarkMode = useSelector((state) =>  state.theme.isDarkMode);
    const dispatch = useDispatch();

    const backgroundImage = isDarkMode
    ? require('../../assets/DarkMode.jpg')
    : require('../../assets/LightMode.jpg')

    return(
        <ImageBackground source={backgroundImage} style={styles.background}>
            <View style={styles.container}>
            {/**HEADER SECTION*/}
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
            {/**CARD SECTION*/}
            <Card isDarkMode={isDarkMode} style={{ height: 580, justifyContent: 'center', backgroundColor: '#d5cfcf', borderColor: '#000', bottom: 70}}>
                <View style={styles.cardContent}>
                    <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity style={styles.plan}>
                            <Image
                                source={require('../../assets/PricingTerms2022.jpg')}
                                style={styles.cardImage}
                            />
                            <Text style={styles.planLabelText}> Pricing Terms 2022</Text>
                        </TouchableOpacity>
                    </View>
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