import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAppSelector } from '../hooks/hooks';

const LoadingScreen = () => {
    const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

    return (
        <View style={[
            styles.container,
            { backgroundColor: isDarkMode ? '#000' : '#fff' }
        ]}>
            <ActivityIndicator 
                size="large" 
                color={isDarkMode ? '#fff' : '#000'}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default LoadingScreen; 