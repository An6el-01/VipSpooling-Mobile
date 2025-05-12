import React from "react";
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, Image } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { useAppSelector } from '../../hooks/hooks';
import Card from "../../components/Card";

const styles= StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
    },
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    text:{
        fontSize: 20,
        fontWeight: '700',
    },
    button: {
        backgroundColor: '#FFD700',
        padding: 10,
        borderRadius: 10,
        borderWidth: 1.3,
        flexDirection: 'row',
        borderColor: '#000',
        justifyContent: 'center',
        width: '70%',
        alignSelf: 'center',
    },
    buttonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '600',
    },
    buttonArrow: {
        height: 22,
        width: 22,
        marginLeft: 15,
    },
});

const RequestSentConfirmed = () => {
    const navigation = useNavigation();
    const isDarkMode = useAppSelector((state) =>  state.theme.isDarkMode);

    const backgroundImage = isDarkMode
    ? require('../../assets/DarkMode.jpg')
    : require('../../assets/LightMode.jpg')

    return(
        <ImageBackground source={backgroundImage} style={styles.background}>
            <View style={styles.container}>
                <Card style={{marginBottom: '50'}}>
                    <Text style={styles.text}>Request Sent ✅</Text>
                </Card>
                <TouchableOpacity style={styles.button} onPress={() => {navigation.navigate('Home')}}>
                    <Text style={styles.buttonText}>Back to Home</Text>
                    <Image
                        source={require('../../assets/right-arrow.png')}
                        style={styles.buttonArrow}
                    />
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

export default RequestSentConfirmed;  