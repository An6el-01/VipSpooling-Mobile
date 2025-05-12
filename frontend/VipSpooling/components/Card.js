import React from 'react';
import { View, StyleSheet } from 'react-native';

const Card = ({ children, isDarkMode, style }) => {
    const backgroundColor = isDarkMode ? styles.darkBackground : styles.lightBackground;

    return (
        <View style={[styles.card,backgroundColor, style]}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 10,
        borderWidth: 1.3,
        padding: 23,
        marginVertical: 1,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3, // For android shadow
    },
    lightBackground: {
        backgroundColor: '#fff',
        borderColor: '#000'
    },
    darkBackground: {
        backgroundColor: '#000',
        borderColor: '#fff',
    },
});

export default Card;