import React, {useState} from 'react';
import {View, Text, TouchableOpacity, ImageBackground, StyleSheet, Image, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../../store/themeSlice';
import Card from '../../components/Card';
import CustomBottomTab from '../../components/CustomBottomTab';

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
});

const MyInvoices = () => {
    const navigation = useNavigation();
    const isDarkMode = useSelector((state) =>  state.theme.isDarkMode);
    const dispatch =  useDispatch();
    const [searchQuery, setSearchQuery] = useState('');

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
                            My Invoices
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
                        {/*
                        ADD IN LINE STYLING
                            - Make the Invoice stretch across the entire Card
                        */}
                        <Card isDarkMode={isDarkMode} style={{padding: 8}}>
                            {[1, 2, 3, 4, 5, 6].map((item, index) => (
                                <View key={index} style={[styles.activityCard, { backgroundColor: isDarkMode ? '#000' : '#fff', borderBottomColor: isDarkMode ? '#fff' : '#000'}]}>
                                <View style={styles.activityDetails}>
                                    <Text style={[styles.activityText, {color: isDarkMode ? '#fff' : '#000'}]}>Invoice {item}</Text>
                                    <Text style={[styles.activityText, {fontSize: 12 }]}>
                                    {18 + index}/11/2024 - INV-0000{item}
                                    </Text>
                                </View>
                                <TouchableOpacity>
                                    <Image
                                    source={require('../../assets/view.png')}
                                    style={[styles.activityIcon, { tintColor: isDarkMode ? '#fff' : '#000'}]}
                                    />
                                </TouchableOpacity>
                                </View>
                            ))}
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

export default MyInvoices;