import React from 'react';
import { View, StyleSheet } from 'react-native';

const Card = ({ children, isDarkMode }) => {
    const backgroundColor = isDarkMode ? styles.darkBackground : styles.lightBackground;

    return (
        <View style={[styles.card,backgroundColor]}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 10,
        borderWidth: 1.3,
        borderColor: '#000',
        padding: 25,
        marginVertical: 10,
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
    },
    darkBackground: {
        backgroundColor: '#333',
    },
});

export default Card;