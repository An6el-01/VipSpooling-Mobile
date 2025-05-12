import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ImageBackground, Image, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, ScrollView, Platform, Modal, Dimensions, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../../store/themeSlice';
import Card from '../../../components/Card';
import { Dropdown} from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import SignatureScreen from 'react-native-signature-canvas';
import { endpoints } from '../../../config';

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
    },
    container: {
        flex: 1,
        padding: 20,
    },
    scrollContainer: {
        flexGrow: 1,
    },
    contentContainer: {
        flex: 1,
        marginBottom: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    headerIcons: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        right: 0,
        top: 40,
    },
    headerIcon: {
        width: 24,
        height: 24,
        marginLeft: 15,
    },
    title: {    
        fontSize: 34,
        fontWeight: '700',
        marginTop: 120,
        letterSpacing: -0.5,
    },
    goBackButton: {
        position: 'absolute',
        top: 40,    
        left: 2,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderRadius: 20,
    },
    goBackIcon: {
        width: 24,
        height: 24,
        marginRight: 8,
    },
    goBackText: {
        fontSize: 16,
        fontWeight: '600',
    },
    cardContainerContent: {
        width: '100%',
        padding: 2,
        borderRadius: 12,
    },
    fieldText: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#000',
        marginTop: 4,
    },
    inputField: {   
        flexDirection: 'row',
        alignItems: 'flex-start',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 16,
        width: '100%',
        borderWidth: 1,
        backgroundColor: '#F5F5F5',
        borderColor: '#E0E0E0',
    },
    inputText: {
        color: '#000',
        fontSize: 16,
        flex: 1,
        fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    },
    personnelContainer: {
        marginTop: 5,
        width: '100%',
    },
    personnelHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 4,
        borderBottomWidth: 1,
        paddingBottom: 10,
        borderBottomColor: '#E0E0E0',   
    },
    addPersonnelButton: {
        backgroundColor: '#FFD700',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 22,
        borderWidth: 1,
        borderColor: '#000',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    addPersonnelText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
    },
    personnelItem: {
        borderRadius: 12,
        padding: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        marginBottom: 16,
    },
    removePersonnelButton: {
        position: 'absolute',
        right: 12,
        top: 1,
        padding: 4,
        zIndex: 1,
        borderRadius: 12,
    },
    removePersonnelText: {
        color: '#FF3B30',
        fontSize: 20,
        fontWeight: '600',
    },
    signatureButton: {
        backgroundColor: '#FFD700',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 22,
        borderWidth: 1,
        borderColor: '#000',
        alignItems: 'center',
        marginTop: 4,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    signatureButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    signatureModal: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    signatureHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 50,
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        backgroundColor: '#FFF',
        zIndex: 1,
    },
    signatureContainer: {
        flex: 1,
        backgroundColor: '#FFF',
        marginTop: 16,
        marginBottom: 80, // Space for buttons at bottom
    },
    signatureButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        backgroundColor: '#FFF',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1,
    },
    modalButton: {
        flex: 1,
        marginHorizontal: 8,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
    },
    clearButton: {
        backgroundColor: '#FFF',
        borderColor: '#000',
        marginBottom: 15,
    },
    confirmButton: {
        backgroundColor: '#FFD700',
        borderColor: '#000',
        marginBottom: 15,
    },
    modalButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    fieldContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        paddingVertical: 8,
    },
    dateFieldText: {
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
    },
    finishButton: {
        backgroundColor: '#FFD700',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 22,
        borderWidth: 1,
        borderColor: '#000',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        alignSelf: 'center',
        width: '90%',
        marginBottom: 28,
    },
    finishButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    inputContainer: {
        marginBottom: 3,
    },
    carouselContainer: {
        width: '100%',
        marginVertical: 16,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    carouselHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        paddingBottom: 16,
        marginBottom: 16,
    },
    stepTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
        textAlign: 'center',
        flex: 1,
    
    },
    stepIndicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    stepDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    carouselNavigation: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 20,
        marginBottom: 10,
    },
    navButton: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    navButtonText: {
        fontSize: 26,
        fontWeight: '600',
        color: '#000',
    },
});

const AddJsaForm = () => {
    const navigation = useNavigation();
    const isDarkMode = useSelector((state) => state.theme.isDarkMode);
    const dispatch = useDispatch();
    const [formDate, setFormDate] = useState(new Date());
    const [formattedDate, setFormattedDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0]; // This will give 'YYYY-MM-DD' format
    });
    const [personnel, setPersonnel] = useState([{ personName: '', role: '', signature: '' }]);
    const [showSignatureModal, setShowSignatureModal] = useState(false);
    const [currentPersonnelIndex, setCurrentPersonnelIndex] = useState(null);
    const [workTicketID, setWorkTicketID] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [customerLocation, setCustomerLocation] = useState('');
    const signatureRef = useRef(null);
    const [signatureDataUrl, setSignatureDataUrl] = useState('');
    const [currentStep, setCurrentStep] = useState(0);
    const [steps, setSteps] = useState([
        { stepNo: '1', task: 'Disconnect DH Cable', hazards: 'Electrical', controls: 'LOTO, Hot Gloves', ppe: 'ABFGIKRE', riskRating: 'low', notes: '' },
        { stepNo: '2', task: 'Fiange up BOP', hazards: 'Pinch points and overhead hazards, slips, trips', controls: 'Hard hat, gloves, ST boots, safety glasses, tag lines', ppe: 'ABFGIKR', riskRating: 'low', notes: '' },
        { stepNo: '3', task: 'Unseat and remove hanger', hazards: 'Pinch points and overhead hazards, slips, trips', controls: 'Hard hat, gloves, ST boots, safety glasses', ppe: 'ABFGIKR', riskRating: 'low', notes: '' },
        { stepNo: '4', task: 'Rig up spoolers and pull well', hazards: 'Pinch points and overhead hazards, slips, trips', controls: 'Hard hat, gloves, ST boots, safety glasses, tag lines', ppe: 'ABFGIKR', riskRating: 'low', notes: '' },
        { stepNo: '5', task: 'Dissassemble and lay down', hazards: 'Pinch points and overhead hazards, slips, trips', controls: 'Hard hat, gloves, ST boots, safety glasses, tag lines', ppe: 'ABFGIKR', riskRating: 'low', notes: '' },
        { stepNo: '6', task: '', hazards: '', controls: '', ppe: '', riskRating: '', notes: '' },
    ]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const backgroundImage = isDarkMode 
    ? require('../../../assets/DarkMode.jpg')
    : require('../../../assets/LightMode.jpg')

    useEffect(() => {
        fetchWorkTicketID();
    }, []);

    const onDateChange = (event, selectedDate) => {
        if (selectedDate) {
            setFormDate(selectedDate);
            const formatted = selectedDate.toISOString().split('T')[0]; // This will give 'YYYY-MM-DD' format
            setFormattedDate(formatted);
        }
    };

    const addPersonnel = () => {
        setPersonnel([...personnel, { personName: '', role: '', signature: '' }]);
    };

    const removePersonnel = (index) => {
        const newPersonnel = [...personnel];
        newPersonnel.splice(index, 1);
        setPersonnel(newPersonnel);
    };

    const updatePersonnel = (index, field, value) => {
        const newPersonnel = [...personnel];
        newPersonnel[index][field] = value;
        setPersonnel(newPersonnel);
    };

    const handleSignature = (signatureResult) => {
        if (currentPersonnelIndex !== null) {
            const base64Data = signatureResult.replace('data:image/png;base64,', '');
            updatePersonnel(currentPersonnelIndex, 'signature', base64Data);
            setSignatureDataUrl('');
        }
        setShowSignatureModal(false);
    };

    const handleEditSignature = (index) => {
        setCurrentPersonnelIndex(index);
        const signature = personnel[index].signature;
        if (signature) {
            setSignatureDataUrl(`data:image/png;base64,${signature}`);
        } else {
            setSignatureDataUrl('');
        }
        setShowSignatureModal(true);
    };

    const openSignatureModal = (index) => {
        handleEditSignature(index);
    };

    const handleClear = () => {
        signatureRef.current?.clearSignature();
        setSignatureDataUrl('');
    };

    const handleConfirm = () => {
        signatureRef.current?.readSignature();
    };

    const fetchWorkTicketID = async () => {
        try{
            console.log('Fetching Work Ticket ID from:', endpoints.generateWorkTicketIDJsa);
            const response = await fetch(endpoints.generateWorkTicketIDJsa, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Received data:', data);

            if (data.workTicketID) {
                setWorkTicketID(data.workTicketID);
            } else {
                console.error('Failed to generate Work Ticket ID (AddJsaForm.js):', data.error || 'No workTicketID in response');
            }
        } catch (error) {
            console.error('Error fetching Work Ticket ID (AddJsaForm.js):', error.message);
            console.error('Full error:', error);
        }
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;
        
        try {
            setIsSubmitting(true);
            
            // Instead of filtering, ensure all required fields have at least a space character
            const formattedSteps = steps.map(step => ({
                step: step.task && step.task.trim() !== '' ? step.task : ' ',
                safetyEnvironmental: step.hazards && step.hazards.trim() !== '' ? step.hazards : ' ',
                controls: step.controls && step.controls.trim() !== '' ? step.controls : ' ',
                ppe: step.ppe && step.ppe.trim() !== '' ? step.ppe : ' ',
                risk: step.riskRating && step.riskRating.trim() !== '' ? step.riskRating : ' ', 
                notes: step.notes && step.notes.trim() !== '' ? step.notes : ' '
            }));

            const formattedPersonnel = personnel.map(person => ({
                PersonName: person.personName && person.personName.trim() !== '' ? person.personName : ' ',
                Role: person.role && person.role.trim() !== '' ? person.role : ' ',
                Signature: person.signature || ''
            }));

            const formData = {
                WorkTicketID: workTicketID,
                CustomerName: customerName || ' ',
                Location: customerLocation || ' ',
                FormDate: formattedDate,
                EffectiveDate: formattedDate,
                Steps: formattedSteps,
                Personnel: formattedPersonnel
            };

            console.log('Submitting JSA form data:', formData);

            const response = await fetch(endpoints.createJSAForm, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! status: ${response.status}, message: ${JSON.stringify(errorData)}`);
            }

            const result = await response.json();
            console.log('Form submitted successfully:', result);
            
            Alert.alert(
                'Success',
                'JSA Form saved successfully!',
                [{ text: 'OK', onPress: () => navigation.goBack() }]
            );

        } catch (error) {
            console.error('Error submitting JSA form:', error);
            Alert.alert(
                'Error',
                `Failed to submit the form: ${error.message}`,
                [{ text: 'OK' }]
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleNextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const updateStepField = (field, value) => {
        const updatedSteps = [...steps];
        updatedSteps[currentStep] = {
            ...updatedSteps[currentStep],
            [field]: value
        };
        setSteps(updatedSteps);
    };

    return(
        <ImageBackground source={backgroundImage} style={styles.background}>
            <KeyboardAvoidingView 
                style={{ flex: 1 }} 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    keyboardShouldPersistTaps="handled"
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.container}>
                            <View style={styles.contentContainer}>
                                {/* Header Section */}
                                <View style={styles.header}>
                                    <TouchableOpacity
                                        style={styles.goBackButton}
                                        onPress={() => navigation.goBack()}
                                        accessibilityRole="button"
                                        accessibilityLabel="Go back to previous screen"
                                    >
                                        <Image
                                            source={require('../../../assets/arrowBack.png')}
                                            style={[styles.goBackIcon, { tintColor: isDarkMode ? '#fff' : '#000' }]}
                                        />
                                        <Text style={[styles.goBackText, { color: isDarkMode ? '#fff' : '#000'}]}>
                                            Go Back
                                        </Text>
                                    </TouchableOpacity>
                                    <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#000' }]}>
                                        Add New JSA Form
                                    </Text>
                                    <TouchableOpacity 
                                        onPress={() => dispatch(toggleTheme())}
                                        style={styles.headerIcons}
                                        accessibilityRole="button"
                                        accessibilityLabel={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                                    >
                                        <Image
                                            source={isDarkMode ? require('../../../assets/sun.png') : require('../../../assets/moon.png')}
                                            style={[styles.headerIcon, { tintColor: isDarkMode ? '#fff' : '#000' }]}
                                        />
                                    </TouchableOpacity>
                                </View>

                                {/* Form Section */}
                                <Card isDarkMode={isDarkMode}>
                                    <View style={styles.cardContainerContent}>

                                        {/**Form ID Input */}
                                        <View style={styles.inputContainer}>
                                            <Text style={[styles.fieldText, {color: isDarkMode ? '#fff' : '#000'}]}>JSA Form ID:</Text>
                                            <View style={styles.inputField}>
                                                <TextInput
                                                    style={styles.inputText}
                                                    placeholder='Loading...'
                                                    placeholderTextColor={'#000'}
                                                    value={workTicketID}
                                                    editable={false}
                                                />
                                            </View>
                                        </View>

                                        {/* Customer Name Input */}
                                        <View style={styles.inputContainer}>
                                            <Text style={[styles.fieldText, { color: isDarkMode ? '#fff' : '#000'}]}>
                                                Customer Name:
                                            </Text>
                                            <View style={styles.inputField}>
                                                <TextInput
                                                    placeholder="Enter customer name"
                                                    placeholderTextColor={isDarkMode ? '#999' :'#aaa'}
                                                    style={[styles.inputText, { color: '#000' }]}
                                                    keyboardType="default"
                                                    autoCapitalize="words"
                                                    value={customerName}
                                                    onChangeText={setCustomerName}
                                                    accessibilityLabel="Customer name input"
                                                    accessibilityHint="Enter the name of the customer"
                                                />
                                            </View>
                                        </View>

                                        {/* Customer Location Input */}
                                        <View style={styles.inputContainer}>
                                            <Text style={[styles.fieldText, { color: isDarkMode ? '#fff' : '#000' }]}>
                                                Customer Location:
                                            </Text>
                                            <View style={styles.inputField}>
                                                <TextInput
                                                    placeholder="Enter customer location"
                                                    placeholderTextColor={isDarkMode ? '#999' : '#aaa'}
                                                    style={[styles.inputText, { color: '#000' }]}
                                                    keyboardType="default"
                                                    autoCapitalize="words"
                                                    value={customerLocation}
                                                    onChangeText={setCustomerLocation}
                                                    accessibilityLabel="Customer location input"
                                                    accessibilityHint="Enter the location of the customer"
                                                />
                                            </View>
                                        </View>

                                         {/* Order Date Input */}
                                         <View style={styles.fieldContainer}>
                                            <Text style={[styles.dateFieldText, {color: isDarkMode ? '#fff' : '#000' }]}>
                                                Order Date:
                                            </Text>
                                            <DateTimePicker
                                                testID="dateTimePicker"
                                                value={formDate}
                                                mode="date"
                                                display={Platform.OS === 'ios' ? 'compact' : 'default'}
                                                onChange={onDateChange}
                                                style={{ width: '50%' }}
                                                textColor={isDarkMode ? '#fff' : '#000'}
                                                themeVariant={isDarkMode ? 'dark' : 'light'}
                                                accessibilityLabel="Date picker"
                                            />
                                        </View>
                                        
                                    </View>
                                </Card>

                                {/* STEPS CAROUSEL SECTION */}
                                <Card isDarkMode={isDarkMode} style={{ marginTop: 16 }}>
                                    <View style={styles.cardContainerContent}>
                                        <View style={styles.carouselContainer}>
                                            <View style={styles.carouselHeader}>
                                                <TouchableOpacity 
                                                    style={[styles.navButton, { opacity: currentStep === 0 ? 0.5 : 1 }]}
                                                    onPress={handlePrevStep}
                                                    disabled={currentStep === 0}
                                                >
                                                    <Text style={styles.navButtonText}>←</Text>
                                                </TouchableOpacity>
                                                
                                                <Text style={[styles.stepTitle, { color: '#000' }]}>
                                                    Step {currentStep + 1} of 6
                                                </Text>
                                                
                                                <TouchableOpacity 
                                                    style={[styles.navButton, { opacity: currentStep === 5 ? 0.5 : 1 }]}
                                                    onPress={handleNextStep}
                                                    disabled={currentStep === 5}
                                                >
                                                    <Text style={styles.navButtonText}>→</Text>
                                                </TouchableOpacity>
                                            </View>

                                            {/* Step Input Fields */}
                                            <View>
                                                <Text style={[styles.fieldText, { color: '#000' }]}>Task/Step:</Text>
                                                <View style={styles.inputField}>
                                                    <TextInput
                                                        style={styles.inputText}
                                                        value={steps[currentStep].task}
                                                        onChangeText={(text) => updateStepField('task', text)}
                                                        placeholder="Enter task/step description"
                                                        placeholderTextColor={isDarkMode ? '#999' : '#aaa'}
                                                    />
                                                </View>

                                                <Text style={[styles.fieldText, { color: '#000' }]}>Potential Safety/Environmental Hazards:</Text>
                                                <View style={[styles.inputField, { height: 100, alignItems: 'flex-start' }]}>
                                                    <TextInput
                                                        style={[styles.inputText, { height: '100%', textAlignVertical: 'top' }]}
                                                        value={steps[currentStep].hazards}
                                                        onChangeText={(text) => updateStepField('hazards', text)}
                                                        placeholder="Enter potential hazards"
                                                        placeholderTextColor={isDarkMode ? '#999' : '#aaa'}
                                                        multiline={true}
                                                        numberOfLines={4}
                                                    />
                                                </View>

                                                <Text style={[styles.fieldText, { color: '#000' }]}>Identified Hazard/Risk Controls:</Text>
                                                <View style={[styles.inputField, { height: 100, alignItems: 'flex-start' }]}>
                                                    <TextInput
                                                        style={[styles.inputText, { height: '100%', textAlignVertical: 'top' }]}
                                                        value={steps[currentStep].controls}
                                                        onChangeText={(text) => updateStepField('controls', text)}
                                                        placeholder="Enter risk controls"
                                                        placeholderTextColor={isDarkMode ? '#999' : '#aaa'}
                                                        multiline={true}
                                                        numberOfLines={4}
                                                    />
                                                </View>

                                                <Text style={[styles.fieldText, { color: '#000' }]}>Required PPE:</Text>
                                                <View style={styles.inputField}>
                                                    <TextInput
                                                        style={styles.inputText}
                                                        value={steps[currentStep].ppe}
                                                        onChangeText={(text) => updateStepField('ppe', text)}
                                                        placeholder="Enter required PPE"
                                                        placeholderTextColor={isDarkMode ? '#999' : '#aaa'}
                                                    />
                                                </View>

                                                <Text style={[styles.fieldText, { color: '#000' }]}>Risk Rating:</Text>
                                                <View style={styles.inputField}>
                                                    <TextInput
                                                        style={styles.inputText}
                                                        value={steps[currentStep].riskRating}
                                                        onChangeText={(text) => updateStepField('riskRating', text)}
                                                        placeholder="Enter risk rating"
                                                        placeholderTextColor={isDarkMode ? '#999' : '#aaa'}
                                                    />
                                                </View>

                                                <Text style={[styles.fieldText, { color: '#000' }]}>Notes/Comments:</Text>
                                                <View style={[styles.inputField, { height: 100, alignItems: 'flex-start' }]}>
                                                    <TextInput
                                                        style={[styles.inputText, { height: '100%', textAlignVertical: 'top' }]}
                                                        value={steps[currentStep].notes}
                                                        onChangeText={(text) => updateStepField('notes', text)}
                                                        placeholder="Enter additional notes"
                                                        placeholderTextColor={isDarkMode ? '#999' : '#aaa'}
                                                        multiline={true}
                                                        numberOfLines={4}
                                                    />
                                                </View>
                                            </View>

                                            {/* Step Indicators at the bottom */}
                                            <View style={styles.stepIndicatorContainer}>
                                                {steps.map((_, index) => (
                                                    <View
                                                        key={index}
                                                        style={[
                                                            styles.stepDot,
                                                            {
                                                                backgroundColor: currentStep === index 
                                                                    ? '#FFD700' 
                                                                    : isDarkMode ? '#555' : '#ccc'
                                                            }
                                                        ]}
                                                    />
                                                ))}
                                            </View>
                                        </View>
                                    </View>
                                </Card>

                                {/* Personnel Section */}
                                <Card isDarkMode={isDarkMode} style={{ marginTop: 10 }}>
                                    <View style={styles.cardContainerContent}>
                                        <View style={styles.personnelHeader}>
                                            <Text style={[styles.fieldText, { color: isDarkMode ? '#fff' : '#000', marginBottom: 0 }]}>
                                                Personnel
                                            </Text>
                                            {personnel.length > 0 && (
                                                <TouchableOpacity
                                                    style={[styles.addPersonnelButton, { borderColor: isDarkMode ? '#fff' : '#000' }]}
                                                    onPress={addPersonnel}
                                                    accessibilityRole="button"
                                                    accessibilityLabel="Add additional personnel"
                                                    accessibilityHint="Adds another personnel entry form"
                                                >
                                                    <Text style={styles.addPersonnelText}>
                                                        Add Personnel
                                                    </Text>
                                                </TouchableOpacity>
                                            )}
                                        </View>

                                        {personnel.map((person, index) => (
                                            <Card isDarkMode={isDarkMode}
                                                key={index} 
                                                style={[styles.personnelItem, { borderColor: isDarkMode ? '#fff' : '#E0E0E0' }]}
                                                accessibilityLabel={`Personnel entry ${index + 1}`}
                                            >
                                                {personnel.length > 1 && (
                                                    <TouchableOpacity
                                                        style={styles.removePersonnelButton}
                                                        onPress={() => removePersonnel(index)}
                                                        accessibilityLabel={`Remove personnel ${index + 1}`}
                                                    >
                                                        <Text style={styles.removePersonnelText}>×</Text>
                                                    </TouchableOpacity>
                                                )}

                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={[styles.fieldText, { color: isDarkMode ? '#fff' : '#000' }]}>
                                                            Name:
                                                        </Text>
                                                        <View style={styles.inputField}>
                                                            <TextInput
                                                                placeholder="Enter name"
                                                                placeholderTextColor={isDarkMode ? '#999' : '#aaa'}
                                                                style={[styles.inputText, { color: '#000' }]}
                                                                value={person.personName}
                                                                onChangeText={(text) => updatePersonnel(index, 'personName', text)}
                                                                accessibilityLabel="Person name input"
                                                            />
                                                        </View>
                                                    </View>

                                                    <View style={{ flex: 1 }}>
                                                        <Text style={[styles.fieldText, { color: isDarkMode ? '#fff' : '#000' }]}>
                                                            Role:
                                                        </Text>
                                                        <View style={styles.inputField}>
                                                            <TextInput
                                                                placeholder="Enter role"
                                                                placeholderTextColor={isDarkMode ? '#999' : '#aaa'}
                                                                style={[styles.inputText, { color: '#000' }]}
                                                                value={person.role}
                                                                onChangeText={(text) => updatePersonnel(index, 'role', text)}
                                                                accessibilityLabel="Role input"
                                                            />
                                                        </View>
                                                    </View>
                                                </View>

                                                <TouchableOpacity
                                                    style={[styles.signatureButton, { borderColor: isDarkMode ? '#fff' : '#000' }]}
                                                    onPress={() => openSignatureModal(index)}
                                                    accessibilityRole="button"
                                                    accessibilityLabel={person.signature ? "Edit signature" : "Add signature"}
                                                >
                                                    <Text style={styles.signatureButtonText}>
                                                        {person.signature ? 'Edit Signature' : 'Add Signature'}
                                                    </Text>
                                                </TouchableOpacity>
                                            </Card>
                                        ))}
                                    </View>
                                </Card>
                            </View>

                            <TouchableOpacity
                                style={[
                                    styles.finishButton, 
                                    { 
                                        borderColor: isDarkMode ? '#fff' : '#000',
                                        opacity: isSubmitting ? 0.7 : 1 
                                    }
                                ]}
                                onPress={handleSubmit}
                                disabled={isSubmitting}
                                accessibilityRole="button"
                                accessibilityLabel="Finish JSA Form"
                            >
                                <Text style={styles.finishButtonText}>
                                    {isSubmitting ? 'Saving...' : 'Finish JSA Form'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Signature Modal */}
            <Modal
                visible={showSignatureModal}
                animationType="slide"
                onRequestClose={() => setShowSignatureModal(false)}
                statusBarTranslucent
            >
                <View style={styles.signatureModal}>
                    <View style={styles.signatureHeader}>
                        <Text style={[styles.fieldText, { color: '#000' }]}>Draw Signature</Text>
                        <TouchableOpacity
                            onPress={() => setShowSignatureModal(false)}
                            accessibilityLabel="Close signature modal"
                        >
                            <Text style={[styles.modalButtonText, { color: '#000' }]}>Close</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.signatureContainer}>
                        <SignatureScreen
                            ref={signatureRef}
                            onOK={handleSignature}
                            onEmpty={() => console.log('Empty')}
                            autoClear={false}
                            descriptionText="Sign here"
                            imageType="image/png"
                            dataURL={signatureDataUrl}
                            webStyle={`
                                .m-signature-pad {
                                    margin: 0;
                                    border: none;
                                    width: 100%;
                                    height: 200%;
                                }
                                .m-signature-pad--body {
                                    border: none;
                                }
                                .m-signature-pad--body canvas {
                                    width: 100%;
                                    height: 100%;
                                }
                                .m-signature-pad--footer {
                                    display: none;
                                }
                            `}
                        />
                    </View>

                    <View style={styles.signatureButtons}>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.clearButton]}
                            onPress={handleClear}
                            accessibilityLabel="Clear signature"
                        >
                            <Text style={[styles.modalButtonText, { color: '#000' }]}>Clear</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.confirmButton]}
                            onPress={handleConfirm}
                            accessibilityLabel="Confirm signature"
                        >
                            <Text style={[styles.modalButtonText, { color: '#000' }]}>Confirm</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ImageBackground>
    );
}

export default AddJsaForm;
