import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Text} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '../hooks/hooks';


const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        bottom: 20,
        left: '5%',
        width: '90%',
        height: 75,
        backgroundColor: '#fff',
        borderRadius: 20,
        borderWidth: 1.3,
        borderTopWidth: 2,
        borderColor: '#000',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 15,
        paddingRight: 15,
    },
    darkModeTabBar: {
        backgroundColor: '#000',
        borderColor: '#fff',
    },
    tabButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 60
    },
    tabIcon: {
        width: 30,
        height: 30,
    },
    tabLabel: {
        fontSize: 12,
        marginTop: 5,
        fontWeight: '600',
    },
});

const CustomBottomTab = () => {
    const navigation = useNavigation();
    const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

    const tabs =[
        {name: 'Home', icon: require('../assets/home.png')},
        {name: 'Forms', icon: require('../assets/invoice.png')},
        {name: 'My Team', icon: require('../assets/team.png')},
        {name: 'Plans', icon: require('../assets/plansIcon.png')},
    ];

    return(
        <View style={[styles.tabBar, isDarkMode ? styles.darkModeTabBar : null]}>
            {tabs.map((tab, index) => (
                <TouchableOpacity key={index} onPress={() => navigation.navigate(tab.name)} style={styles.tabButton}>
                    <Image source={tab.icon} style={[styles.tabIcon, {tintColor: isDarkMode ? '#fff' : '#000'}]}/>
                    <Text style={[styles.tabLabel, { color: isDarkMode ? '#fff' : '#000'}]}>{tab.name}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default CustomBottomTab;