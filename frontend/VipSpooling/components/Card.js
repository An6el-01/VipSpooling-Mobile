import React from 'react';
import { View, Stylesheet } from 'react-native';

const Card = ({ size = "medium", childreb, isDarkMode }) => {
    //Determine the size styles dynamically
    const sizeStyles =
        size === 'xsmall'
            ? styles.xsmall
            : size === 'small'
            ? styles.small
            : size === 'large'
            ? styles.large
            : styles.medium

    const backgroundColor = isDarkMode ? styles.darkBackground : styles.lightBackground;

    return (
        <View style={[styles.card, sizeStyles, backgroundColor]}>
            {children}
        </View>
    );
};

const styles = Stylesheet.create({
    card: {
        borderRadius: 10,
        padding: 10,
        marginVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3, // For android shadow
    },
    xsmall: {
        width: 80,
        height: 80,
    },
    small: {
        width: 100,
        height: 100,
    },
    medium: {
        width: 200,
        height: 150,
    },
    large: {
        width: 300,
        height: 200,
    },
    lightBackground: {
        backgroundColor: '#fff',
    },
    darkBackground: {
        backgroundColor: '#333',
    },
});

export default Card;