import React, {useState} from 'react';
import {View, Text, TouchableOpacity, ImageBackground, StyleSheet} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center', 
        padding: 20,
    }
})

const Settings = () => {
    const navigation = useNavigation();
    const isDarkMode = useSelector((state) =>  state.theme.isDarkMode);

    const backgroundImage = isDarkMode
    ? require('../assets/DarkMode.jpg')
    : require('../assets/LightMode.jpg')

    return(
        <ImageBackground source={backgroundImage} style={styles.background}>
            <View style={styles.container}>
            <Text>Settings Page</Text>
                <TouchableOpacity 
                    onPress={() => {navigation.navigate('Home');
                    }}
                >
                    <Text>Back Home</Text>
                </TouchableOpacity>
        </View>
        </ImageBackground>
    );
};

export default Settings;