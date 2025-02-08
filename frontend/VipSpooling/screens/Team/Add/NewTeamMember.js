import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ImageBackground, Image, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../../store/themeSlice';
import Card from '../../../components/Card';
import { Dropdown, MultiSelect, dropdwon } from 'react-native-element-dropdown';
import { isDraft } from '@reduxjs/toolkit';


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
    scrollContainer: {
        flexGrow: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerIcons: {
        flexDirection: 'row',
        alignItems: 'center',
        top: 30,
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
        top: 30,
    },
    goBackButton: {
        position: 'absolute',
        top: 30,
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
        width: '100%',
        borderWidth: 1.3,
        backgroundColor: '#EAE7E7',
    },
    inputText: {
        color: '#000',
        fontSize: 16,
        flex: 1,
    },
    dropdownContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 15,
        marginBottom: 22,
        width: '100%',
        borderWidth: 1.3,
        backgroundColor: '#EAE7E7',
    },
    dropdownStyle: {
        flex: 1,
        backgroundColor: '#EAE7E7',
        borderRadius: 8,
    },
    placeholderText: {
        fontSize: 16,
        color: '#5e5e5e',
    },
    selectedTextStyle: {
        fontSize: 16,
        color: '#000',
    },
    tagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 5,
    },
    tag: {
        backgroundColor: '#FFD700',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
        marginRight: 8,
        marginBottom: 8,
        flexDirection: 'row'
    },
    tagText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
    },
    removeTag: {
        marginLeft: 8,
        color: 'red',
        fontWeight: 'bold',
    },
   inviteButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',  // Centers content horizontally
    flexDirection: 'row',
    gap: 10,  // Adds spacing between text and arrow
    width: '100%',
    borderWidth: 1.3,
    borderColor: '#000',
    marginTop: 15,
    paddingHorizontal: 32,
    left: 8,
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
    },
    dropdownArrow: {
        height: 24,
        width: 24,
    },
});

const NewTeamMember = () => {
    const navigation = useNavigation();
    const isDarkMode = useSelector((state) => state.theme.isDarkMode);
    const dispatch = useDispatch();

    const [selectedTemplates, setSelectedTemplates] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);

    const templates = [
        { label: 'Automatic Invoice Form', value: 'invoice' },
        { label: 'JSA Form', value: 'jsa' },
    ];

    const roles = [
        { label: 'Admin', value: 'admin' },
        { label: 'Team Member', value: 'teamMember' },
    ]

    const backgroundImage = isDarkMode
        ? require('../../../assets/DarkMode.jpg')
        : require('../../../assets/LightMode.jpg')

        const removeTemplate = (value) => {
            setSelectedTemplates(selectedTemplates.filter(item => item !== value));
        };

    return (
        <ImageBackground source={backgroundImage} style={styles.background}>
            <KeyboardAvoidingView style={{ flex: 1}} behavior="padding">
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1}}
                    keyboardShouldPersistTaps="handled"
                    bounces={false}
                >
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
                                {/** Templates Dropdown */}
                                <Text style={[styles.fieldText, { color: isDarkMode ? '#fff' : '#000' }]}>Select Templates</Text>
                                <View style={[styles.dropdownContainer, { borderColor: isDarkMode ? '#fff' : '#000' }]}>
                                <MultiSelect
                                        data={templates}
                                        labelField="label"
                                        valueField="value"
                                        value={selectedTemplates}
                                        onChange={setSelectedTemplates}
                                        search={false}
                                        style={styles.dropdownStyle}
                                        placeholder={selectedTemplates.length === 0 ? 'Select Templates' : `${selectedTemplates.length} selected`}
                                        placeholderStyle={styles.placeholderText}
                                        selectedTextStyle={{ display: 'none' }}
                                    />
                                </View>

                                {selectedTemplates.length > 0 && (
                                    <View style={styles.tagContainer}>
                                        {templates.filter(template => selectedTemplates.includes(template.value))
                                            .map((template) => (
                                                <View key={template.value} style={styles.tag}>
                                                    <Text style={styles.tagText}>{template.label}</Text>
                                                    <TouchableOpacity onPress={() => removeTemplate(template.value)}>
                                                        <Text style={styles.removeTag}>❌</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            ))
                                        }
                                    </View>
                                )}
                                

                                {/** Role Dropdown */}
                                <Text style={[styles.fieldText, { color: isDarkMode ? '#fff' : '#000' }]}>Assign Role</Text>
                                <View style={[styles.dropdownContainer, { borderColor: isDarkMode ? '#fff' : '#000' }]}>
                                    <Dropdown
                                        data={roles}
                                        labelField="label"
                                        valueField="value"
                                        placeholder='Select Role'
                                        value={selectedRole}
                                        onChange={item => setSelectedRole(item.value)}
                                        search={false}
                                        style={styles.dropdownStyle}
                                        placeholderStyle={[styles.placeholderText, {color: isDarkMode ? '#5e5e5e' : '#aaa'}]}
                                        selectedTextStyle={styles.selectedTextStyle}
                                    />
                                </View>
                                {/**BUTTON SECTION*/}
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
                </ScrollView>
            </KeyboardAvoidingView>
        </ImageBackground>

    );
};

export default NewTeamMember;