// Bugs on the dropdown more specifically the templates dropdown.

import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ImageBackground, Image, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, FlatList, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../../store/themeSlice';
import Card from '../../../components/Card';
import { Provider as PaperProvider, Menu, Divider } from 'react-native-paper';

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
    },
    container: {
        flex: 1,
        alignItems: 'center',
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
        top: 20,
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
        top: 50,
    },
    goBackButton: {
        position: 'absolute',
        top: 20,
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
        fontWeight: '600',
    },
    cardContainerContent: {
        justifyContent: 'center',
        width: '100%',
        paddingHorizontal: 1,
    },
    fieldText: {
        position: 'relative',
        marginBottom: 15,
        fontSize: 16,
        fontWeight: '600',
    },
    inputField: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 14,
        marginBottom: 22,
        width: '115%',
        borderWidth: 1.3,
        backgroundColor: '#EAE7E7',
    },
    inputText: {
        color: '#fff',
        fontSize: 16,
        flex: 1,
    },
    dropdownButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 15,
        marginBottom: 22,
        width: '100%',
        borderWidth: 1.3,
        backgroundColor: '#EAE7E7',
    },
    dropdownArrow: {
        width: 20,
        height: 20,
    },
    inviteButton: {
        left: 32,
        backgroundColor: '#FFD700',
        paddingVertical: 14,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        borderWidth: 1.3,
        flexDirection: 'row',
        borderColor: '#000',
        marginTop: 15,
    },
    inviteButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '600',
    },
    buttonArrow: {
        height: 22,
        width: 22,
        marginLeft: 10,
        marginRight: 12,
    },
    dropdownArrow: {
        height: 24,
        width: 24,
    },
    menuItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    menuItemText: {
        fontSize: 16,
        color: '#000',
    },
    menuDivider: {
        backgroundColor: '#ccc',
    },
    closeMenuButton: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        alignItems: 'center',
        backgroundColor: '#ddd',
    },
    closeMenuText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
});

const NewTeamMember = () => {
    const navigation = useNavigation();
    const isDarkMode = useSelector((state) => state.theme.isDarkMode);
    const dispatch = useDispatch();

    const [templateDropdownVisible, setTemplateDropdownVisible] = useState(false);
    const [roleDropdownVisible, setRoleDropdownVisible] = useState(false);
    const [selectedTemplates, setSelectedTemplates] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);

    const templates = ['Automatic Invoice Form', 'JSA Form'];
    const roles = ['Team Member', 'Admin'];

    const backgroundImage = isDarkMode
        ? require('../../../assets/DarkMode.jpg')
        : require('../../../assets/LightMode.jpg')

    const toggleTemplateSelection = (template) => {
        setSelectedTemplates((prev) => {
            if (prev.includes(template)) {
                return prev.filter((t) => t !== template);
            } else {
                return [...prev, template];
            }
        });
    }

    return (
        <PaperProvider>
            <ImageBackground source={backgroundImage} style={styles.background}>
                <KeyboardAvoidingView style={styles.container} behavior="padding">
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.container}>
                            {/**HEADER SECTION*/}
                            <View style={styles.header}>
                                <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#000' }]}>
                                    New Team Member
                                </Text>
                                <TouchableOpacity
                                    style={styles.goBackButton}
                                    onPress={() => (navigation.goBack())}
                                >
                                    <Image
                                        source={require('../../../assets/arrowBack.png')}
                                        style={[styles.goBackIcon, { tintColor: isDarkMode ? '#fff' : '#000' }]}
                                    />
                                    <Text style={[styles.goBackText, { color: isDarkMode ? '#fff' : '#000' }]}>
                                        Go Back
                                    </Text>
                                </TouchableOpacity>
                                <View style={styles.headerIcons}>
                                    <TouchableOpacity onPress={() => dispatch(toggleTheme())}>
                                        <Image
                                            source={isDarkMode
                                                ? require('../../../assets/sun.png')
                                                : require('../../../assets/moon.png')
                                            }
                                            style={[styles.headerIcon, { tintColor: isDarkMode ? '#fff' : '#000' }]}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => { navigation.navigate('Settings') }}>
                                        <Image
                                            source={require('../../../assets/settings.png')}
                                            style={[styles.headerIcon, { tintColor: isDarkMode ? '#fff' : '#000' }]}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {/**FORM SECTION*/}
                            <Card isDarkMode={isDarkMode}>
                                <View style={styles.cardContainerContent}>
                                    {/**Name Input Field*/}
                                    <Text style={[styles.fieldText, { color: isDarkMode ? '#fff' : '#000' }]}>Name</Text>
                                    <View style={[styles.inputField, { borderColor: isDarkMode ? '#fff' : '#000' }]}>
                                        <TextInput
                                            placeholder='Full Name'
                                            placeholderTextColor={isDarkMode ? '#5e5e5e' : '#aaa'}
                                            style={styles.inputText}
                                            keyboardType="ascii-capable"
                                            autoCapitalize='none'
                                        />
                                    </View>
                                    {/**EMAIL INPUT FIELD*/}
                                    <Text style={[styles.fieldText, { color: isDarkMode ? '#fff' : '#000' }]}>User's Email</Text>
                                    <View style={[styles.inputField, { borderColor: isDarkMode ? '#fff' : '#000' }]}>
                                        <TextInput
                                            placeholder="Email Address"
                                            placeholderTextColor={isDarkMode ? '#5e5e5e' : '#aaa'}
                                            style={styles.inputText}
                                            keyboardType='email-address'
                                            autoCapitalize='none'
                                        />
                                    </View>
                                    {/**TEMPLATE DROPDOWN*/}
                                    <Text style={styles.fieldText}>Select Templates</Text>
                                    <Menu
                                        visible={templateDropdownVisible}
                                        onDismiss={() => {}}
                                        anchor={
                                            <TouchableOpacity
                                                style={styles.dropdownButton}
                                                onPress={() => setTemplateDropdownVisible(!templateDropdownVisible)}
                                            >
                                                <Text style={[{ color: isDarkMode ? '#5e5e5e' : '#aaa' }]}>
                                                    {selectedTemplates.length > 0 ? selectedTemplates.join(', ') : 'Select Templates'}
                                                </Text>
                                                <Image
                                                    source={require('../../../assets/down-arrow.png')}
                                                    style={styles.dropdownArrow}
                                                />
                                            </TouchableOpacity>
                                        }
                                    >
                                        {templates.map((template, index) => (
                                            <TouchableOpacity key={index} onPress={() => toggleTemplateSelection(template)}>
                                                <View style={[styles.menuItem, selectedTemplates.includes(template) && { backgroundColor: '#ddd' }]}> 
                                                    <Text style={styles.menuItemText}>
                                                        {selectedTemplates.includes(template) ? '✔ ' : ''}{template}
                                                    </Text>
                                                </View>
                                                {index !== templates.length - 1 && <Divider style={styles.menuDivider} />}
                                            </TouchableOpacity>
                                        ))}
                                        <TouchableOpacity onPress={() => setTemplateDropdownVisible(false)} style={styles.closeMenuButton}>
                                            <Text style={styles.closeMenuText}>Done</Text>
                                        </TouchableOpacity>
                                    </Menu>
                                    {/**ROLE DROPDOWN*/}
                                    <Text style={[styles.fieldText, { color: isDarkMode ? '#fff' : '#000' }]}>Assign Role</Text>
                                    <Menu
                                        visible={roleDropdownVisible}
                                        onDismiss={() => setRoleDropdownVisible(false)}
                                        anchor={
                                            <TouchableOpacity
                                                style={[styles.dropdownButton, { borderColor: isDarkMode ? '#fff' : '#000' }]}
                                                onPress={() => setRoleDropdownVisible(true)}
                                            >
                                                <Text style={[{ color: isDarkMode ? '#5e5e5e' : '#aaa' }]}>
                                                    {selectedRole ? selectedRole : 'Select Role'}
                                                </Text>
                                                <Image
                                                    source={require('../../../assets/down-arrow.png')}
                                                    style={styles.dropdownArrow}
                                                />
                                            </TouchableOpacity>
                                        }
                                        contentStyle={{ backgroundColor: isDarkMode ? '#333' : '#fff', borderRadius: 12 }}
                                    >
                                        {roles.map((role, index) => (
                                            <React.Fragment key={index}>
                                                <Menu.Item
                                                    onPress={() => {
                                                        setSelectedRole(role);
                                                        setRoleDropdownVisible(false);
                                                    }}
                                                    title={role}
                                                    titleStyle={[styles.menuItemText, { color: isDarkMode ? '#fff' : '#000' }]}
                                                    style={styles.menuItem}
                                                />
                                                {index < roles.length - 1 && <Divider style={styles.menuDivider} />}
                                            </React.Fragment>
                                        ))}
                                    </Menu>
                                    <TouchableOpacity style={styles.inviteButton}>
                                        <Text style={styles.inviteButtonText}>
                                            Send Invitation Code
                                        </Text>
                                        <Image
                                            source={require('../../../assets/right-arrow.png')}
                                            style={styles.buttonArrow}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </Card>
                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </ImageBackground>
        </PaperProvider>
    );
};

export default NewTeamMember;