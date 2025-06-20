import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ImageBackground, Image, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, ScrollView, Platform, Modal, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import { toggleTheme } from '../../../store/themeSlice';
import Card from '../../../components/Card';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { fetchAuthSession } from '@aws-amplify/auth';
import { endpoints } from '../../../config/config';
import { useScreenCleanup } from '../../../hooks/useScreenCleanUp';
import { jwtDecode } from 'jwt-decode';
import * as ImagePicker from 'expo-image-picker';

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
        width: '100%',
    },
    contentContainer: {
        flexGrow: 1,
        width: '100%',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerIcons: {
        flexDirection: 'row',
        alignItems: 'center',
        top: 35,
        right: 20,
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
        top: 40,
        left: 20,
    },
    sectionTitle:{
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 25,
        color: '#000',
        marginTop: 10,
        textAlign: 'center',
        textDecorationLine: 'underline',
    },
    goBackButton: {
        position: 'absolute',
        top: 35,
        left: 20,
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
        textAlignVertical: 'top',
    },
    dateFieldText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        alignSelf: 'center',
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 10,
        justifyContent: 'space-between',
        paddingRight: 15,
    },
    datePickerContainer: {
        flex: 0.7,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },
    dateButton: {
        backgroundColor: '#EAE7E7',
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 14,
        borderWidth: 1.3,
        justifyContent: 'center',
        width: '100%',
    },
    dateButtonText: {
        fontSize: 16,
        color: '#000',
    },
    finishButton: {
        backgroundColor: '#FFD700',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 22,
        borderWidth: 1,
        borderColor: '#000',
        elevation: 3,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        alignSelf: 'center',
        width: '90%',
    },
    finishButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    inputContainer: {
        marginBottom: 16,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        flex: 1,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderRadius: 4,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxLabel: {
        fontSize: 16,
        fontWeight: '500',
    },
    checkboxInner: {
        width: 14,
        height: 14,
        borderRadius: 2,
    },
    jobTypeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    errorContainer: {
        padding: 10,
        marginVertical: 10,
        backgroundColor: 'rgba(255, 0, 0, 0.1)',
        borderRadius: 5,
        width: '100%',
    },
    errorText: {
        fontSize: 14,
        textAlign: 'center',
        fontWeight: '500',
    },
    pumpingIntervalContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 10,
    },
    pumpingCheckboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        minWidth: '30%',
        marginRight: 5,
    },
    pumpingCheckboxLabel: {
        fontSize: 14,
        fontWeight: '500',
        flexShrink: 1,
    },
    modalView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    pickerWindow: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        maxHeight: '80%',
    },
    pickerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    pickerTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    closeButton: {
        padding: 10,
    },
    closeButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    itemButton: {
        padding: 10,
    },
    itemButtonText: {
        fontSize: 16,
    },
    dropdownField: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    dropdownArrow: {
        fontSize: 20,
        color: '#000',
        paddingRight: 5,
    },
    notesInputField: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 14,
        marginBottom: 22,
        width: '100%',
        height: 150,
        borderWidth: 1.3,
        backgroundColor: '#EAE7E7',
    },
    notesInputText: {
        color: '#000',
        fontSize: 16,
        flex: 1,
        textAlignVertical: 'top',
        minHeight: 120,
    },
    fileUploadSection: {
        marginBottom: 50,
    },
    uploadContainer: {
        borderWidth: 1,
        borderStyle: 'dashed',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
    },
    uploadIcon: {
        width: 40,
        height: 40,
        marginBottom: 10,
        tintColor: '#666',
    },
    uploadText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 5,
    },
    uploadSubText: {
        fontSize: 14,
        color: '#999',
    },
    selectedFileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#EAE7E7',
        padding: 10,
        borderRadius: 8,
        marginTop: 10,
    },
    fileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    fileIcon: {
        width: 24,
        height: 24,
        marginRight: 10,
    },
    fileName: {
        fontSize: 14,
        color: '#000',
        flex: 1,
    },
    fileSize: {
        fontSize: 12,
        color: '#666',
        marginLeft: 10,
    },
    deleteButton: {
        padding: 5,
    },
    deleteIcon: {
        width: 20,
        height: 20,
        tintColor: '#666',
    },
});

const AddCapillaryForm = () => {
    console.log('AddCapillaryForm component rendering');
    
    const navigation = useNavigation();
    const route = useRoute();
    const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
    const { idToken, userAttributes } = useAppSelector((state) => {
        console.log('Auth selector called, current idToken:', !!idToken);
        return state.auth;
    });
    const dispatch = useAppDispatch();
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [formDate, setFormDate] = useState(new Date());
    const [formattedDate, setFormattedDate] = useState('');
    const [technicianName, setTechnicianName] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [jobType, setJobType] = useState({
        install: false,
        pull: false,
        other: false
    });
    const [fluidConfirmation, setFluidConfirmation] = useState({
        yes: false,
        no: false,
        other: false
    });
    const [pumpingInterval, setPumpingInterval] = useState({
        thirtyMin: false,
        oneHour: false,
        other: false
    });
    const [pressureBleedDown, setPressureBleedDown] = useState({
        yes: false,
        no: false,
        other: false
    });
    const [capillaryFlushed, setCapillaryFlushed] = useState({
        tenGal: false,
        fifteenGal: false,
        twentyGal: false,
        no: false,
        other: false
    });
    const [capillarySize, setCapillarySize] = useState('');
    const [showCapillarySizePicker, setShowCapillarySizePicker] = useState(false);
    const [metallurgy, setMetallurgy] = useState('');
    const [showMetallurgyPicker, setShowMetallurgyPicker] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);

    // Check if we're in editing mode
    const isEditing = route.params?.isEditing || false;
    const existingFormData = route.params?.formData || null;

    const capillarySizeOptions = ['1/4', '3/8'];
    const metallurgyOptions = ['825', '2205'];

    const backgroundImage = isDarkMode
        ? require('../../../assets/DarkMode.jpg')
        : require('../../../assets/LightMode.jpg');

    // Initialize technician name once
    useEffect(() => {
        console.log('Name initialization effect running');
        if (idToken) {
            try {
                const decodedToken = jwtDecode(idToken);
                const name = decodedToken.name || userAttributes?.name || '';
                setTechnicianName(name);
            } catch (error) {
                console.error('Error decoding token:', error);
                setError('Failed to load user information');
            }
        }
    }, [idToken, userAttributes?.name]);

    // Populate form fields when editing
    useEffect(() => {
        if (isEditing && existingFormData) {
            console.log('Populating Capillary form with existing data:', existingFormData);
            
            // Populate basic fields
            setFormattedDate(existingFormData.Date || formattedDate);
            setTechnicianName(existingFormData.TechnicianName || technicianName);
            
            // Note: You'll need to add more field mappings based on your Capillary form structure
            // This is a basic example - you may need to add more fields based on your actual form data
        }
    }, [isEditing, existingFormData]);

    // Handle cleanup with useCallback to maintain reference stability
    const cleanupFunction = useCallback(() => {
        setShowDatePicker(false);
        setJobType({
            install: false,
            pull: false,
            other: false
        });
        Keyboard.dismiss();
    }, []); // Empty dependency array since these functions are stable

    // Use the cleanup function
    useScreenCleanup(cleanupFunction);

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || formDate;
        if (Platform.OS === 'android') {
            setShowDatePicker(false);
        }
        if (selectedDate) {
            setFormDate(currentDate);
            const formatted = currentDate.toISOString().split('T')[0].replace(/-/g, '/');
            setFormattedDate(formatted);
        }
    };

    const handleJobTypeChange = (type) => {
        const newJobType = {
            install: false,
            pull: false,
            other: false
        };
        newJobType[type] = true;
        setJobType(newJobType);
    };

    const handleFluidConfirmationChange = (type) => {
        const newFluidConfirmation = {
            yes: false,
            no: false,
            other: false
        };
        newFluidConfirmation[type] = true;
        setFluidConfirmation(newFluidConfirmation);
    };

    const handlePumpingIntervalChange = (type) => {
        const newPumpingInterval = {
            thirtyMin: false,
            oneHour: false,
            other: false
        };
        newPumpingInterval[type] = true;
        setPumpingInterval(newPumpingInterval);
    };

    const handlePressureBleedDownChange = (type) => {
        const newPressureBleedDown = {
            yes: false,
            no: false,
            other: false
        };
        newPressureBleedDown[type] = true;
        setPressureBleedDown(newPressureBleedDown);
    };

    const handleCapillaryFlushedChange = (type) => {
        const newCapillaryFlushed = {
            tenGal: false,
            fifteenGal: false,
            twentyGal: false,
            no: false,
            other: false
        };
        newCapillaryFlushed[type] = true;
        setCapillaryFlushed(newCapillaryFlushed);
    };

    const pickImage = async () => {
        try {
            // Request permission
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to upload images.');
                return;
            }

            // Pick the image
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: false,
                quality: 1,
            });

            if (!result.canceled && result.assets && result.assets[0]) {
                const newFile = {
                    uri: result.assets[0].uri,
                    name: result.assets[0].uri.split('/').pop(),
                    size: (result.assets[0].fileSize / 1024 / 1024).toFixed(2), // Convert to MB
                    type: 'image/jpeg',
                };
                setSelectedFiles(prev => [...prev, newFile]);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Error', 'Failed to pick image');
        }
    };

    const removeFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    // Add error message display in the UI
    const renderError = () => {
        if (!error) return null;
        return (
            <View style={styles.errorContainer}>
                <Text style={[styles.errorText, { color: '#FF0000' }]}>
                    {error}
                </Text>
            </View>
        );
    };

    return (
        <ImageBackground source={backgroundImage} style={styles.background}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
                <ScrollView
                    contentContainerStyle={styles.contentContainer}
                    style={styles.scrollContainer}
                    keyboardShouldPersistTaps="handled"
                    bounces={false}
                    showsVerticalScrollIndicator={true}
                    persistentScrollbar={true}
                    overScrollMode="never"
                >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.container}>
                            {/**HEADER SECTION */}
                            <View style={styles.header}>
                                <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#000'}]}>
                                    {isEditing ? 'Edit Capillary Tubing Report Form' : 'Add New Capillary Tubing Report Form'}
                                </Text>
                                <TouchableOpacity
                                    style={styles.goBackButton}
                                    onPress={() => navigation.goBack()}
                                >
                                    <Image
                                        source={require('../../../assets/arrowBack.png')}
                                        style={[styles.goBackIcon, { tintColor: isDarkMode ? '#fff' : '#000'}]}
                                    />
                                    <Text style={[styles.goBackText, { color: isDarkMode ? '#fff' : '#000'}]}>
                                        Go Back
                                    </Text>
                                </TouchableOpacity>
                                <View style={styles.headerIcons}>
                                    <TouchableOpacity onPress={() => dispatch(toggleTheme())}>
                                        <Image
                                            source={isDarkMode ? require('../../../assets/sun.png') : require('../../../assets/moon.png')}
                                            style={[styles.headerIcon, { tintColor: isDarkMode ? '#fff' : '#000'}]}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Add error message display */}
                            {renderError()}

                            {/**FORM SECTION */}
                            <Card isDarkMode={isDarkMode}>
                                <View style={styles.cardContainerContent}>
                                    {/* Date Input */}
                                    <View style={styles.dateContainer}>
                                        <Text style={[styles.dateFieldText, { color: isDarkMode ? '#fff' : '#000' }]}>
                                            Date:
                                        </Text>
                                        <View style={styles.datePickerContainer}>
                                            {Platform.OS === 'android' ? (
                                                <>
                                                    <TouchableOpacity 
                                                        onPress={() => setShowDatePicker(true)}
                                                        style={styles.dateButton}
                                                    >
                                                        <Text style={styles.dateButtonText}>
                                                            {formattedDate || 'Select Date'}
                                                        </Text>
                                                    </TouchableOpacity>
                                                    {showDatePicker && (
                                                        <DateTimePicker
                                                            testID="dateTimePicker"
                                                            value={formDate}
                                                            mode="date"
                                                            display="default"
                                                            onChange={onDateChange}
                                                            style={{ width: '100%' }}
                                                            textColor={isDarkMode ? '#fff' : '#000'}
                                                            themeVariant={isDarkMode ? 'dark' : 'light'}
                                                        />
                                                    )}
                                                </>
                                            ) : (
                                                <DateTimePicker
                                                    testID="dateTimePicker"
                                                    value={formDate}
                                                    mode="date"
                                                    display="compact"
                                                    onChange={onDateChange}
                                                    style={{ width: '100%' }}
                                                    textColor={isDarkMode ? '#fff' : '#000'}
                                                    themeVariant={isDarkMode ? 'dark' : 'light'}
                                                />
                                            )}
                                        </View>
                                    </View>

                                    {/**TECHNICIAN NAME INPUT */}
                                    <View style={styles.inputContainer}>
                                        <Text style={[styles.fieldText, { color: isDarkMode ? '#fff' : '#000' }]}>
                                            Technician Name:
                                        </Text>
                                        <View style={styles.inputField}>
                                            <TextInput
                                                style={styles.inputText}
                                                placeholder="Enter Technician Name"
                                                placeholderTextColor={'#000'}
                                                value={technicianName}
                                                editable={false}
                                                onChangeText={setTechnicianName}
                                            />
                                        </View>
                                    </View>

                                    {/**CUSTOMER INPUT */}
                                    <View style={styles.inputContainer}>
                                        <Text style={[styles.fieldText, { color: isDarkMode ? '#fff' : '#000' }]}>
                                            Customer:
                                        </Text>
                                        <View style={styles.inputField}>
                                            <TextInput
                                                style={styles.inputText}
                                                placeholder="Enter Customer Name"
                                                placeholderTextColor={'#000'}
                                            />
                                        </View>
                                    </View>

                                    {/**WELL NAME INPUT */}
                                    <View style={styles.inputContainer}>
                                        <Text style={[styles.fieldText, { color: isDarkMode ? '#fff' : '#000'}]}>
                                            Well Name:
                                        </Text>
                                        <View style={styles.inputField}>
                                            <TextInput
                                                style={styles.inputText}
                                                placeholder="Enter Well Name"
                                                placeholderTextColor={'#000'}
                                            />
                                        </View>
                                    </View>

                                    {/**TYPE OF JOB INPUT*/}
                                    <View style={styles.inputContainer}>
                                        <Text style={[styles.fieldText, {color: isDarkMode ? '#fff' : '#000'}]}>
                                            Type of Job:
                                        </Text>
                                        <View style={styles.jobTypeContainer}>
                                            <TouchableOpacity 
                                                style={styles.checkboxContainer}
                                                onPress={() => handleJobTypeChange('install')}
                                            >
                                                <View style={[
                                                    styles.checkbox, 
                                                    { borderColor: isDarkMode ? '#fff' : '#000' }
                                                ]}>
                                                    {jobType.install && (
                                                        <View style={[
                                                            styles.checkboxInner, 
                                                            { backgroundColor: isDarkMode ? '#fff' : '#000' }
                                                        ]} />
                                                    )}
                                                </View>
                                                <Text style={[
                                                    styles.checkboxLabel, 
                                                    { color: isDarkMode ? '#fff' : '#000' }
                                                ]}>
                                                    Install
                                                </Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity 
                                                style={styles.checkboxContainer}
                                                onPress={() => handleJobTypeChange('pull')}
                                            >
                                                <View style={[
                                                    styles.checkbox, 
                                                    { borderColor: isDarkMode ? '#fff' : '#000' }
                                                ]}>
                                                    {jobType.pull && (
                                                        <View style={[
                                                            styles.checkboxInner, 
                                                            { backgroundColor: isDarkMode ? '#fff' : '#000' }
                                                        ]} />
                                                    )}
                                                </View>
                                                <Text style={[
                                                    styles.checkboxLabel, 
                                                    { color: isDarkMode ? '#fff' : '#000' }
                                                ]}>
                                                    Pull
                                                </Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity 
                                                style={styles.checkboxContainer}
                                                onPress={() => handleJobTypeChange('other')}
                                            >
                                                <View style={[
                                                    styles.checkbox, 
                                                    { borderColor: isDarkMode ? '#fff' : '#000' }
                                                ]}>
                                                    {jobType.other && (
                                                        <View style={[
                                                            styles.checkboxInner, 
                                                            { backgroundColor: isDarkMode ? '#fff' : '#000' }
                                                        ]} />
                                                    )}
                                                </View>
                                                <Text style={[
                                                    styles.checkboxLabel, 
                                                    { color: isDarkMode ? '#fff' : '#000' }
                                                ]}>
                                                    Other
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    {/**Capillary Flush Details */}
                                    <Text style={[styles.sectionTitle, { color: isDarkMode ? '#fff' : '#000'}]}>Capillary Flush Details</Text>

                                    {/**VISUAL/CONFIRMATION FLUID AT BHA */}
                                    <View style={styles.inputContainer}>
                                        <Text style={[styles.fieldText, {color: isDarkMode ? '#fff' : '#000'}]}>
                                            Visual/Confirmation Fluid at BHA (Did we pump and see fluid at intake?):
                                        </Text>
                                        <View style={styles.jobTypeContainer}>
                                            <TouchableOpacity 
                                                style={styles.checkboxContainer}
                                                onPress={() => handleFluidConfirmationChange('yes')}
                                            >
                                                <View style={[
                                                    styles.checkbox, 
                                                    { borderColor: isDarkMode ? '#fff' : '#000' }
                                                ]}>
                                                    {fluidConfirmation.yes && (
                                                        <View style={[
                                                            styles.checkboxInner, 
                                                            { backgroundColor: isDarkMode ? '#fff' : '#000' }
                                                        ]} />
                                                    )}
                                                </View>
                                                <Text style={[
                                                    styles.checkboxLabel, 
                                                    { color: isDarkMode ? '#fff' : '#000' }
                                                ]}>
                                                    Yes
                                                </Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity 
                                                style={styles.checkboxContainer}
                                                onPress={() => handleFluidConfirmationChange('no')}
                                            >
                                                <View style={[
                                                    styles.checkbox, 
                                                    { borderColor: isDarkMode ? '#fff' : '#000' }
                                                ]}>
                                                    {fluidConfirmation.no && (
                                                        <View style={[
                                                            styles.checkboxInner, 
                                                            { backgroundColor: isDarkMode ? '#fff' : '#000' }
                                                        ]} />
                                                    )}
                                                </View>
                                                <Text style={[
                                                    styles.checkboxLabel, 
                                                    { color: isDarkMode ? '#fff' : '#000' }
                                                ]}>
                                                    No
                                                </Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity 
                                                style={styles.checkboxContainer}
                                                onPress={() => handleFluidConfirmationChange('other')}
                                            >
                                                <View style={[
                                                    styles.checkbox, 
                                                    { borderColor: isDarkMode ? '#fff' : '#000' }
                                                ]}>
                                                    {fluidConfirmation.other && (
                                                        <View style={[
                                                            styles.checkboxInner, 
                                                            { backgroundColor: isDarkMode ? '#fff' : '#000' }
                                                        ]} />
                                                    )}
                                                </View>
                                                <Text style={[
                                                    styles.checkboxLabel, 
                                                    { color: isDarkMode ? '#fff' : '#000' }
                                                ]}>
                                                    Other
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    {/**INTERVAL PUMPING THROUGHT JOB */}
                                    <View style={styles.inputContainer}>
                                        <Text style={[styles.fieldText, {color: isDarkMode ? '#fff' : '#000'}]}>
                                            Interval Pumping Throughout Job:
                                        </Text>
                                        <View style={styles.pumpingIntervalContainer}>
                                            <TouchableOpacity 
                                                style={styles.pumpingCheckboxContainer}
                                                onPress={() => handlePumpingIntervalChange('thirtyMin')}
                                            >
                                                <View style={[
                                                    styles.checkbox, 
                                                    { borderColor: isDarkMode ? '#fff' : '#000' }
                                                ]}>
                                                    {pumpingInterval.thirtyMin && (
                                                        <View style={[
                                                            styles.checkboxInner, 
                                                            { backgroundColor: isDarkMode ? '#fff' : '#000' }
                                                        ]} />
                                                    )}
                                                </View>
                                                <Text style={[
                                                    styles.pumpingCheckboxLabel, 
                                                    { color: isDarkMode ? '#fff' : '#000' }
                                                ]}>
                                                    30min Intervals
                                                </Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity 
                                                style={styles.pumpingCheckboxContainer}
                                                onPress={() => handlePumpingIntervalChange('oneHour')}
                                            >
                                                <View style={[
                                                    styles.checkbox, 
                                                    { borderColor: isDarkMode ? '#fff' : '#000' }
                                                ]}>
                                                    {pumpingInterval.oneHour && (
                                                        <View style={[
                                                            styles.checkboxInner, 
                                                            { backgroundColor: isDarkMode ? '#fff' : '#000' }
                                                        ]} />
                                                    )}
                                                </View>
                                                <Text style={[
                                                    styles.pumpingCheckboxLabel, 
                                                    { color: isDarkMode ? '#fff' : '#000' }
                                                ]}>
                                                    1Hr Intervals
                                                </Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity 
                                                style={styles.pumpingCheckboxContainer}
                                                onPress={() => handlePumpingIntervalChange('other')}
                                            >
                                                <View style={[
                                                    styles.checkbox, 
                                                    { borderColor: isDarkMode ? '#fff' : '#000' }
                                                ]}>
                                                    {pumpingInterval.other && (
                                                        <View style={[
                                                            styles.checkboxInner, 
                                                            { backgroundColor: isDarkMode ? '#fff' : '#000' }
                                                        ]} />
                                                    )}
                                                </View>
                                                <Text style={[
                                                    styles.pumpingCheckboxLabel, 
                                                    { color: isDarkMode ? '#fff' : '#000' }
                                                ]}>
                                                    Other
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    {/**PRESSURE WHILE PUMPING AT INTERVALS */}
                                    <View style={styles.inputContainer}>
                                        <Text style={[styles.fieldText, {color: isDarkMode ? '#fff' : '#000'}]}>
                                            Pressure While Pumping At Intervals:
                                        </Text>
                                        <View style={styles.inputField}>
                                            <TextInput
                                                style={styles.inputText}
                                                placeholder="Enter Pressure While Pumping At Intervals"
                                                placeholderTextColor={'#000'}
                                            />
                                        </View>
                                    </View>

                                    {/** DID PRESSURE BLEED DOWN WHEN PUMP TURNED OFF AT THE END OF THE JOB?*/}
                                    <View style={styles.inputContainer}>
                                        <Text style={[styles.fieldText, {color: isDarkMode ? '#fff' : '#000'}]}>
                                            Did Pressure Bleed Down When Pump Turned Off At The End Of The Job?
                                        </Text>
                                        <View style={styles.jobTypeContainer}>
                                            <TouchableOpacity 
                                                style={styles.checkboxContainer}
                                                onPress={() => handlePressureBleedDownChange('yes')}
                                            >
                                                <View style={[
                                                    styles.checkbox, 
                                                    { borderColor: isDarkMode ? '#fff' : '#000' }
                                                ]}>
                                                    {pressureBleedDown.yes && (
                                                        <View style={[
                                                            styles.checkboxInner, 
                                                            { backgroundColor: isDarkMode ? '#fff' : '#000' }
                                                        ]} />
                                                    )}
                                                </View>
                                                <Text style={[
                                                    styles.checkboxLabel, 
                                                    { color: isDarkMode ? '#fff' : '#000' }
                                                ]}>
                                                    Yes
                                                </Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity 
                                                style={styles.checkboxContainer}
                                                onPress={() => handlePressureBleedDownChange('no')}
                                            >
                                                <View style={[
                                                    styles.checkbox, 
                                                    { borderColor: isDarkMode ? '#fff' : '#000' }
                                                ]}>
                                                    {pressureBleedDown.no && (
                                                        <View style={[
                                                            styles.checkboxInner, 
                                                            { backgroundColor: isDarkMode ? '#fff' : '#000' }
                                                        ]} />
                                                    )}
                                                </View>
                                                <Text style={[
                                                    styles.checkboxLabel, 
                                                    { color: isDarkMode ? '#fff' : '#000' }
                                                ]}>
                                                    No
                                                </Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity 
                                                style={styles.checkboxContainer}
                                                onPress={() => handlePressureBleedDownChange('other')}
                                            >
                                                <View style={[
                                                    styles.checkbox, 
                                                    { borderColor: isDarkMode ? '#fff' : '#000' }
                                                ]}>
                                                    {pressureBleedDown.other && (
                                                        <View style={[
                                                            styles.checkboxInner, 
                                                            { backgroundColor: isDarkMode ? '#fff' : '#000' }
                                                        ]} />
                                                    )}
                                                </View>
                                                <Text style={[
                                                    styles.checkboxLabel, 
                                                    { color: isDarkMode ? '#fff' : '#000' }
                                                ]}>
                                                    Other
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    {/**WAS CAPILLARY FLUSHED AFTER WELL HEAD INSTALLED INPUT */}
                                    <View style={styles.inputContainer}>
                                        <Text style={[styles.fieldText, {color: isDarkMode ? '#fff' : '#000'}]}>
                                            Was Capillary Flushed After Well Head Installed?
                                        </Text>
                                        <View style={styles.pumpingIntervalContainer}>
                                            <TouchableOpacity 
                                                style={styles.pumpingCheckboxContainer}
                                                onPress={() => handleCapillaryFlushedChange('tenGal')}
                                            >
                                                <View style={[
                                                    styles.checkbox, 
                                                    { borderColor: isDarkMode ? '#fff' : '#000' }
                                                ]}>
                                                    {capillaryFlushed.tenGal && (
                                                        <View style={[
                                                            styles.checkboxInner, 
                                                            { backgroundColor: isDarkMode ? '#fff' : '#000' }
                                                        ]} />
                                                    )}
                                                </View>
                                                <Text style={[
                                                    styles.pumpingCheckboxLabel, 
                                                    { color: isDarkMode ? '#fff' : '#000' }
                                                ]}>
                                                    Yes-10 gal
                                                </Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity 
                                                style={styles.pumpingCheckboxContainer}
                                                onPress={() => handleCapillaryFlushedChange('fifteenGal')}
                                            >
                                                <View style={[
                                                    styles.checkbox, 
                                                    { borderColor: isDarkMode ? '#fff' : '#000' }
                                                ]}>
                                                    {capillaryFlushed.fifteenGal && (
                                                        <View style={[
                                                            styles.checkboxInner, 
                                                            { backgroundColor: isDarkMode ? '#fff' : '#000' }
                                                        ]} />
                                                    )}
                                                </View>
                                                <Text style={[
                                                    styles.pumpingCheckboxLabel, 
                                                    { color: isDarkMode ? '#fff' : '#000' }
                                                ]}>
                                                    Yes-15 gal
                                                </Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity 
                                                style={styles.pumpingCheckboxContainer}
                                                onPress={() => handleCapillaryFlushedChange('twentyGal')}
                                            >
                                                <View style={[
                                                    styles.checkbox, 
                                                    { borderColor: isDarkMode ? '#fff' : '#000' }
                                                ]}>
                                                    {capillaryFlushed.twentyGal && (
                                                        <View style={[
                                                            styles.checkboxInner, 
                                                            { backgroundColor: isDarkMode ? '#fff' : '#000' }
                                                        ]} />
                                                    )}
                                                </View>
                                                <Text style={[
                                                    styles.pumpingCheckboxLabel, 
                                                    { color: isDarkMode ? '#fff' : '#000' }
                                                ]}>
                                                    Yes-20 gal
                                                </Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity 
                                                style={styles.pumpingCheckboxContainer}
                                                onPress={() => handleCapillaryFlushedChange('no')}
                                            >
                                                <View style={[
                                                    styles.checkbox, 
                                                    { borderColor: isDarkMode ? '#fff' : '#000' }
                                                ]}>
                                                    {capillaryFlushed.no && (
                                                        <View style={[
                                                            styles.checkboxInner, 
                                                            { backgroundColor: isDarkMode ? '#fff' : '#000' }
                                                        ]} />
                                                    )}
                                                </View>
                                                <Text style={[
                                                    styles.pumpingCheckboxLabel, 
                                                    { color: isDarkMode ? '#fff' : '#000' }
                                                ]}>
                                                    No
                                                </Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity 
                                                style={styles.pumpingCheckboxContainer}
                                                onPress={() => handleCapillaryFlushedChange('other')}
                                            >
                                                <View style={[
                                                    styles.checkbox, 
                                                    { borderColor: isDarkMode ? '#fff' : '#000' }
                                                ]}>
                                                    {capillaryFlushed.other && (
                                                        <View style={[
                                                            styles.checkboxInner, 
                                                            { backgroundColor: isDarkMode ? '#fff' : '#000' }
                                                        ]} />
                                                    )}
                                                </View>
                                                <Text style={[
                                                    styles.pumpingCheckboxLabel, 
                                                    { color: isDarkMode ? '#fff' : '#000' }
                                                ]}>
                                                    Other
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    {/**Manifold Condition (GOOD/BAD, OR COMMENT) */}
                                    <View style={styles.inputContainer}>
                                        <Text style={[styles.fieldText, {color: isDarkMode ? '#fff' : '#000'}]}>
                                            Manifold Condition:
                                        </Text>
                                        <View style={styles.inputField}>
                                            <TextInput
                                                style={styles.inputText}
                                                placeholder="Enter Manifold Condition"
                                                placeholderTextColor={'#000'}
                                            />
                                        </View>
                                    </View>

                                    {/**IF PULL, DID LINE TEST GOOD */}
                                    <View style={styles.inputContainer}>
                                        <Text style={[styles.fieldText, {color: isDarkMode ? '#fff' : '#000'}]}>
                                            If Pull, Did Line Test Good?
                                        </Text>
                                        <View style={styles.inputField}>
                                            <TextInput
                                                style={styles.inputText}
                                                placeholder="Enter If Line Tested Good?"
                                                placeholderTextColor={'#000'}
                                            />
                                        </View>
                                    </View>

                                    {/**Capillary Line Information Section*/}
                                    <Text style={[styles.sectionTitle, {color: isDarkMode ? '#fff' : '#000'}]}>Capillary Line Information</Text>

                                    {/**CAPILLARY SIZE */}
                                    <View style={styles.inputContainer}>
                                        <Text style={[styles.fieldText, {color: isDarkMode ? '#fff' : '#000'}]}>
                                            Capillary Size:
                                        </Text>
                                        <TouchableOpacity 
                                            style={styles.inputField}
                                            onPress={() => setShowCapillarySizePicker(true)}
                                        >
                                            <View style={styles.dropdownField}>
                                                <Text style={[
                                                    styles.inputText,
                                                    !capillarySize && { color: '#000' }
                                                ]}>
                                                    {capillarySize || 'Select Capillary Size'}
                                                </Text>
                                                <Text style={styles.dropdownArrow}>▼</Text>
                                            </View>
                                        </TouchableOpacity>

                                        <Modal
                                            visible={showCapillarySizePicker}
                                            transparent={true}
                                            animationType="fade"
                                            onRequestClose={() => setShowCapillarySizePicker(false)}
                                        >
                                            <TouchableWithoutFeedback onPress={() => setShowCapillarySizePicker(false)}>
                                                <View style={styles.modalView}>
                                                    <TouchableWithoutFeedback>
                                                        <View style={styles.pickerWindow}>
                                                            <View style={styles.pickerHeader}>
                                                                <Text style={styles.pickerTitle}>Select Capillary Size</Text>
                                                                <TouchableOpacity 
                                                                    style={styles.closeButton}
                                                                    onPress={() => setShowCapillarySizePicker(false)}
                                                                >
                                                                    <Text style={styles.closeButtonText}>Done</Text>
                                                                </TouchableOpacity>
                                                            </View>
                                                            <ScrollView>
                                                                {capillarySizeOptions.map((size) => (
                                                                    <TouchableOpacity
                                                                        key={size}
                                                                        style={styles.itemButton}
                                                                        onPress={() => {
                                                                            setCapillarySize(size);
                                                                            setShowCapillarySizePicker(false);
                                                                        }}
                                                                    >
                                                                        <Text style={[
                                                                            styles.itemButtonText,
                                                                            capillarySize === size && { fontWeight: '600' }
                                                                        ]}>
                                                                            {size}
                                                                        </Text>
                                                                    </TouchableOpacity>
                                                                ))}
                                                            </ScrollView>
                                                        </View>
                                                    </TouchableWithoutFeedback>
                                                </View>
                                            </TouchableWithoutFeedback>
                                        </Modal>
                                    </View>

                                    {/**METALLURGY*/}
                                    <View style={styles.inputContainer}>
                                        <Text style={[styles.fieldText, {color: isDarkMode ? '#fff' : '#000'}]}>
                                            Metallurgy:
                                        </Text>
                                        <TouchableOpacity 
                                            style={styles.inputField}
                                            onPress={() => setShowMetallurgyPicker(true)}
                                        >
                                            <View style={styles.dropdownField}>
                                                <Text style={[
                                                    styles.inputText,
                                                    !metallurgy && { color: '#000' }
                                                ]}>
                                                    {metallurgy || 'Select Metallurgy'}
                                                </Text>
                                                <Text style={styles.dropdownArrow}>▼</Text>
                                            </View>
                                        </TouchableOpacity>

                                        <Modal
                                            visible={showMetallurgyPicker}
                                            transparent={true}
                                            animationType="fade"
                                            onRequestClose={() => setShowMetallurgyPicker(false)}
                                        >
                                            <TouchableWithoutFeedback onPress={() => setShowMetallurgyPicker(false)}>
                                                <View style={styles.modalView}>
                                                    <TouchableWithoutFeedback>
                                                        <View style={styles.pickerWindow}>
                                                            <View style={styles.pickerHeader}>
                                                                <Text style={styles.pickerTitle}>Select Metallurgy</Text>
                                                                <TouchableOpacity 
                                                                    style={styles.closeButton}
                                                                    onPress={() => setShowMetallurgyPicker(false)}
                                                                >
                                                                    <Text style={styles.closeButtonText}>Done</Text>
                                                                </TouchableOpacity>
                                                            </View>
                                                            <ScrollView>
                                                                {metallurgyOptions.map((option) => (
                                                                    <TouchableOpacity
                                                                        key={option}
                                                                        style={styles.itemButton}
                                                                        onPress={() => {
                                                                            setMetallurgy(option);
                                                                            setShowMetallurgyPicker(false);
                                                                        }}
                                                                    >
                                                                        <Text style={[
                                                                            styles.itemButtonText,
                                                                            metallurgy === option && { fontWeight: '600' }
                                                                        ]}>
                                                                            {option}
                                                                        </Text>
                                                                    </TouchableOpacity>
                                                                ))}
                                                            </ScrollView>
                                                        </View>
                                                    </TouchableWithoutFeedback>
                                                </View>
                                            </TouchableWithoutFeedback>
                                        </Modal>
                                    </View>

                                    {/**LENGTH (TOTAL FOOTAGE)*/}
                                    <View style={styles.inputContainer}>
                                        <Text style={[styles.fieldText, {color: isDarkMode ? '#fff' : '#000'}]}>
                                            Length (Total Footage):
                                        </Text>
                                        <View style={styles.inputField}>
                                            <TextInput
                                                style={styles.inputText}
                                                placeholder="Enter Length (Total Footage)"
                                                placeholderTextColor={'#000'}
                                            />
                                        </View>
                                    </View>

                                    {/**TYPE OF FLUID PUMPED*/}
                                    <View style={styles.inputContainer}>
                                        <Text style={[styles.fieldText, {color: isDarkMode ? '#fff' : '#000'}]}>
                                            Type of Fluid Pumped:
                                        </Text>
                                        <View style={styles.inputField}>
                                            <TextInput
                                                style={styles.inputText}
                                                placeholder="Enter Type of Fluid Pumped"
                                                placeholderTextColor={'#000'}
                                            />
                                        </View>
                                    </View>

                                    {/**TOTAL GALLONS OF FLUID DISPLACE */}
                                    <View style={styles.inputContainer}>
                                        <Text style={[styles.fieldText, {color: isDarkMode ? '#fff' : '#000'}]}>
                                            Total Gallons of Fluid Displaced:
                                        </Text>
                                        <View style={styles.inputField}>
                                            <TextInput
                                                style={styles.inputText}
                                                placeholder="Enter Total Gallons of Fluid Displaced"
                                                placeholderTextColor={'#000'}
                                            />
                                        </View>
                                    </View>

                                    {/**Notes For Customer Section*/}
                                    <Text style={[styles.sectionTitle, {color: isDarkMode ? '#fff' : '#000'}]}>Additional Notes For Customer</Text>

                                    {/**NOTES/COMMENTS*/}
                                    <View style={styles.inputContainer}>
                                        <Text style={[styles.fieldText, {color: isDarkMode ? '#fff' : '#000'}]}>
                                            Notes/Comments:
                                        </Text>
                                        <View style={styles.notesInputField}>
                                            <TextInput
                                                style={styles.notesInputText}
                                                placeholder="Enter detailed notes and comments here..."
                                                placeholderTextColor={'#666'}
                                                multiline={true}
                                                numberOfLines={6}
                                                textAlignVertical="top"
                                            />
                                        </View>
                                    </View>

                                    {/**File Upload Section */}
                                    <View style={styles.fileUploadSection}>
                                        <Text style={[styles.fieldText, {color: isDarkMode ? '#fff' : '#000'}]}>
                                            File Upload
                                        </Text>
                                        <TouchableOpacity 
                                            style={styles.uploadContainer}
                                            onPress={pickImage}
                                        >
                                            <Image
                                                source={require('../../../assets/upload.png')}
                                                style={styles.uploadIcon}
                                            />
                                            <Text style={styles.uploadText}>Browse Files</Text>
                                            <Text style={styles.uploadSubText}>Choose a file</Text>
                                        </TouchableOpacity>

                                        {selectedFiles.map((file, index) => (
                                            <View key={index} style={styles.selectedFileContainer}>
                                                <View style={styles.fileInfo}>
                                                    <Image
                                                        source={require('../../../assets/image.png')}
                                                        style={styles.fileIcon}
                                                    />
                                                    <Text style={styles.fileName} numberOfLines={1}>
                                                        {file.name}
                                                    </Text>
                                                    <Text style={styles.fileSize}>
                                                        {file.size}MB
                                                    </Text>
                                                </View>
                                                <TouchableOpacity 
                                                    style={styles.deleteButton}
                                                    onPress={() => removeFile(index)}
                                                >
                                                    <Image
                                                        source={require('../../../assets/delete.png')}
                                                        style={styles.deleteIcon}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        ))}
                                    </View>

                                    <TouchableOpacity
                                        style={[styles.finishButton, { borderColor: isDarkMode ? '#fff' : '#000'}]}
                                        onPress={() => {
                                            // Add your finish form logic here
                                            console.log('Finishing Capillary Form...');
                                        }}
                                        accessibilityRole="button"
                                        accessibilityLabel="Finish Capillary Form"
                                    >
                                        <Text style={styles.finishButtonText}>
                                            {isEditing ? 'Update Capillary Form' : 'Finish Capillary Form'}
                                        </Text>
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

export default AddCapillaryForm;
