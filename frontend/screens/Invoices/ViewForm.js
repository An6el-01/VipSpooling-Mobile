import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAppSelector, useAppDispatch } from '../../hooks/hooks';
import { toggleTheme } from '../../store/themeSlice';
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
    title: {
        fontSize: 30,
        fontWeight: '700',
        marginBottom: 20,
        top: 75,
    },
    header:{
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
    formImage: {
        width: 340,
        height: 480,
        resizeMode:'contain',
    },
    editButton:{
        backgroundColor: '#FFD700',
        borderRadius: 12,  
        borderWidth: 1.3,
        borderColor: '#000',
        paddingVertical: 14,  
        paddingHorizontal: 35,
        alignItems: 'center',  
        justifyContent: 'center',
        width: '100%',  
        alignSelf: 'center',  
        marginTop: 20,
        shadowColor: '#000',  
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3, 
    },
    buttonText: {
        color: '#000',
        fontWeight: '600',
        fontSize: 16,
        textAlign: 'center',
    },
});

const ViewForm = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
    const dispatch = useAppDispatch();

    // Get the form data from navigation params
    const { formData } = route.params || {};

    const backgroundImage = isDarkMode
        ? require('../../assets/DarkMode.jpg')
        : require('../../assets/LightMode.jpg')

    // Determine which form image to show based on _typename
    const getFormImage = () => {
        if (formData?._typename === 'JSA Form') {
            return require('../../assets/JSAForm.jpg');
        }
        if (formData?._typename === 'Invoice Form') {
            return require('../../assets/InvoiceForm.jpg');
        }
        return require('../../assets/CapillaryTubingReportForm_page-0001.jpg');
    };

    return(
        <ImageBackground source={backgroundImage} style={styles.background}>
            <View style={styles.container}>
                {/**HEADER SECTION*/}
                <View style={styles.header}>
                    <Text style={[styles.title, {color: isDarkMode ? '#fff' : '#000'}]}>
                        {formData?._typename || 'Form View'}
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
                                source={
                                    isDarkMode  
                                        ? require('../../assets/sun.png')
                                        : require('../../assets/moon.png')
                                }
                                style={[styles.headerIcon, { tintColor: isDarkMode ? '#fff' : '#000' }]}
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
                {/**FORM VIEW SECTION*/}
                <Card style={[{marginTop: '40', backgroundColor:'#EAE7E7' }]}>
                    <View>
                        <Image
                            source={getFormImage()}
                            style={styles.formImage}
                        />
                        <TouchableOpacity 
                            style={styles.editButton}
                            onPress={() => navigation.navigate('EditForm', { formData })}
                        >
                            <Text style={styles.buttonText}>Edit Form</Text>
                        </TouchableOpacity>
                    </View>
                </Card>
            </View>
        </ImageBackground>
    );
};

export default ViewForm;