import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { useNavigation} from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
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
    cardImage: {
        width: 150,
        height: 150,
        resizeMode: 'contain',
    },
    form:{
        flexDirection: 'column',
    },
    formLabelText: {
      textAlign: 'center', 
      marginTop: 10, 
    },
    requestButton: {
        backgroundColor: '#FFD700',
        padding: 10,
        borderRadius: 10,
        borderWidth: 1.3,
        flexDirection: 'row',
        borderColor:'#000',
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
    }
});

const MyTemplates = () => {
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
                    My Templates
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
               {/**CARD SECTION*/}
               <Card isDarkMode={isDarkMode} style={{ height: 550, justifyContent: 'center', backgroundColor: '#d5cfcf', borderColor: '#000'}}>
                <View style={styles.cardContent}>
                    <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity style={styles.form}>
                            <Image
                                source={require('../../assets/AutomaticInvoiceForm.jpg')}
                                style={styles.cardImage}
                            />
                            <Text style={styles.formLabelText}> Automatic Invoice Form</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.form}>
                            <Image
                                source={require('../../assets/JSAForm.jpg')}
                                style={styles.cardImage}
                            />
                            <Text style={styles.formLabelText}>JSA Form</Text>
                        </TouchableOpacity>
                        
                    </View>
                   
                    <TouchableOpacity style={styles.requestButton}>
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