import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, Image, Switch, TextInput, TouchableWithoutFeedback, Keyboard, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../../store/themeSlice';
import Card from '../../../components/Card';

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
    },
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center', 
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: '100%',
        marginBottom: 20,
    },
    headerIcon: {
        width: 24,
        height: 24,
        top: 35,
    },
    profileContainer: {
        alignItems: 'center',
        marginBottom: 20,
        bottom: 40,
    },
    infoContainer: {
        flex: 1,
        justifyContent: 'center'
    },
    profileCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#FFD700',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        marginBottom: 10,
        borderWidth: 1.3,
        borderColor: '#000000',
    },
    profileIcon: {
        width: 80,
        height: 80,
        resizeMode: 'contain',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 10,
        alignSelf: 'flex-start',
    },
    card: {
        width: '100%',
        borderRadius: 25,
        padding: 15,
        marginBottom: 15,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    lastRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1, // Makes sure text takes full width
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
        marginLeft: 10, // Adjusts spacing between icon and text
    },
    value: {
        fontSize: 14,
        fontWeight: '500',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 10,
        width: '100%',
    },
    logoutText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#B0AEAE',
        marginLeft: 10,
    },
    logoutIcon: {
        width: 21,
        height: 21,
        tintColor: '#B0AEAE',
    },
    logoutArrow: {
        width: 21,
        height: 21,
        tintColor: '#B0AEAE',
    },
    cardIcon: {
        width: 25,
        height: 25,
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
    input: {
        fontSize: 14,
        fontWeight: '500',
        width: 235,
        textAlign: 'right',
    },
    deleteUserButton: {
        backgroundColor: 'red',
        borderRadius: 12,  
        borderWidth: 1.3,
        borderColor: '#000',
        paddingVertical: 14,  
        paddingHorizontal: 25,
        alignItems: 'center',  
        justifyContent: 'center',
        width: '48%',  
        alignSelf: 'center',  
        shadowColor: '#000',  
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3, 
    },
    deleteUserText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 20,
    },
    confirmEditButton: {
        backgroundColor: '#FFD700',
        borderRadius: 12,
        borderWidth: 1.3,
        borderColor: '#000',
        paddingVertical: 14,
        paddingHorizontal: 25,
        alignItems: 'center',
        justifyContent: 'center',
        width: '48%',
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    confirmEditText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
    },
    buttonIcon: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center'
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButtonCancel: {
        backgroundColor: '#ccc',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5, 
        marginRight: 10,
    },
    modalButtonConfirm: {
        backgroundColor: 'red',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    modalButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff'
    },
});

const EditTeamMember = ({ route }) => {
    const navigation = useNavigation();
    const isDarkMode = useSelector((state) => state.theme.isDarkMode);
    const dispatch = useDispatch();
    
    // Get user data from route params
    const { user } = route.params;
    
    // Initialize state with user data
    const [role, setRole] = useState(user?.groups?.join(', ') || '');
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [modalVisible, setModalVisible] = useState(false);

    const backgroundImage = isDarkMode
        ? require('../../../assets/DarkMode.jpg')
        : require('../../../assets/LightMode.jpg');

    return (
        <ImageBackground source={backgroundImage} style={styles.background}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                
                {/* HEADER SECTION */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.goBackButton}
                        onPress={() => {navigation.goBack()}}
                    >
                        <Image
                            source={require('../../../assets/arrowBack.png')}
                            style={[styles.goBackIcon, {tintColor: isDarkMode ? '#fff' : '#000'}]}
                        />
                        <Text style={[styles.goBackText, { color: isDarkMode ? '#fff' : '#000'}]}> Go Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => dispatch(toggleTheme())}>
                        <Image
                            source={isDarkMode ? require('../../../assets/sun.png') : require('../../../assets/moon.png')}
                            style={[styles.headerIcon, { tintColor: isDarkMode ? '#fff' : '#000' }]}
                        />
                    </TouchableOpacity>
                </View>

                {/* PROFILE SECTION */}
                <View style={styles.infoContainer}>
                <View style={styles.profileContainer}>
                    <View style={styles.profileCircle}>
                        <Image source={require('../../../assets/manager.png')} style={[styles.profileIcon, {borderColor: isDarkMode ? '#fff' : '#000'}]} />
                    </View>
                </View>

                {/* PROFILE INFORMATION SECTION */}
                <Text style={[styles.sectionTitle, { color: isDarkMode ? '#fff' : '#000' }]}>Profile Information</Text>
                <Card isDarkMode={isDarkMode} style={styles.card}>
                    <View style={styles.row}>
                        <View style={styles.labelContainer}>
                            <Image source={require('../../../assets/admin.png')} style={[styles.cardIcon, { tintColor:  isDarkMode ? '#fff' : '#000'}]} />
                            <Text style={[styles.label, {color: isDarkMode ? '#fff' : '#000'}]}>Role:</Text>
                        </View>
                        <TextInput
                            style={[styles.input, { color: isDarkMode ? '#fff' : '#000' }]}
                            value={role}
                            onChangeText={setRole}
                        />
                    </View>
                    <View style={styles.row}>
                        <View style={styles.labelContainer}>
                            <Image source={require('../../../assets/id.png')} style={[styles.cardIcon, { tintColor: isDarkMode ? '#fff' : '#000'}]} />
                            <Text style={[styles.label, {color: isDarkMode ? '#fff' : '#000'}]}>Name:</Text>
                        </View>
                        <TextInput
                            style={[styles.input, { color: isDarkMode ? '#fff' : '#000'}]}
                            value={name}
                            onChangeText={setName}
                        />
                    </View>
                    <View style={styles.lastRow}>
                        <View style={styles.labelContainer}>
                            <Image source={require('../../../assets/mail2.png')} style={[styles.cardIcon, {tintColor: isDarkMode ? '#fff' : '#000'}]} />
                            <Text style={[styles.label, {color: isDarkMode ? '#fff' : '#000'}]}>Email:</Text>
                        </View>
                        <TextInput
                            style={[styles.input, { color: isDarkMode ? '#fff' : '#000' }]}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType='email-address'
                        />
                    </View>
                </Card>
                {/* BUTTONS SECTION */}
                <View style={styles.buttonsContainer}>

                <TouchableOpacity style={styles.deleteUserButton} onPress={() => setModalVisible(true)}>
                        <View style={styles.buttonContent}>
                            <Image 
                                source={require('../../../assets/delete.png')}
                                style={[styles.buttonIcon, { tintColor: '#000' }]}
                            />
                            <Text style={styles.deleteUserText}>Delete User</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.confirmEditButton}>
                        <View style={styles.buttonContent}>
                            <Image 
                                source={require('../../../assets/save.png')}
                                style={[styles.buttonIcon, { tintColor: '#000' }]}
                            />
                            <Text style={styles.confirmEditText}>Confirm Edit</Text>
                        </View>
                    </TouchableOpacity>
                    
                    
                </View>
                </View>
                {/**CONFIRMATION MODAL*/}
                <Modal
                    animationType='fade'
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Are you sure you want to delete this user?</Text>
                            <View style={styles.modalButtons}>
                                <TouchableOpacity style={styles.modalButtonCancel} onPress={() => setModalVisible(false)}>
                                    <Text style={styles.modalButtonText}>No</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.modalButtonConfirm} onPress={()=>{setModalVisible(false); navigation.navigate('DeleteConfirmed');}}>
                                    <Text style={styles.modalButtonText}>Yes</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
            </TouchableWithoutFeedback>
        </ImageBackground>
    );
};

export default EditTeamMember;
