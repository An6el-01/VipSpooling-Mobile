import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ImageBackground, Image, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, ScrollView, Platform, Modal, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import { toggleTheme } from '../../../store/themeSlice';
import Card from '../../../components/Card';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { Auth } from 'aws-amplify';
import { endpoints } from '../../../config/config';
import SignatureScreen from 'react-native-signature-canvas';
import { useScreenCleanup } from '../../../hooks/useScreenCleanUp';
import { jwtDecode } from 'jwt-decode';

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
    inputNotesField: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 14,
        marginBottom: 22,
        width: '100%',
        height: 100,
        borderWidth: 1.3,
        backgroundColor: '#EAE7E7',
    },
    inputText: {
        color: '#000',
        fontSize: 16,
        flex: 1,
        textAlignVertical: 'top',
    },
    dropdownContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        backgroundColor: '#fff',
        marginBottom: 15,
    },
    picker: {
        height: 50,
        width: '100%',
    },
    placeholderText: {
        fontSize: 16,
        color: '#5e5e5e',
    },
    selectedTextStyle: {
        fontSize: 16,
        color: '#000',
    },
    laborSection: {
        marginTop: 20,
        marginBottom: 20,
    },
    laborSectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 20,
        color: '#000',
    },
    laborRow: {
        marginBottom: 15,
    },
    laborRowHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    laborLabel: {
        fontSize: 16,
        fontWeight: '400',
        color: '#000',
        flex: 1,
    },
    laborInputsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
    },
    laborInputWrapper: {
        flex: 1,
    },

    laborInput: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 6,
        backgroundColor: '#F5F5F5',
        textAlign: 'center',
    },
    jobTypeSection: {
        marginTop: 20,
        marginBottom: 20,
    },
    jobTypeSectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 15,
        color: '#000',
    },
    mainJobTypeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
        alignItems: 'center',
    },
    radioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
    },
    radioButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    radioSelected: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    radioLabel: {
        fontSize: 16,
        fontWeight: '500',
    },
    additionalJobTypesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '50%',
        marginBottom: 10,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    checkboxLabel: {
        fontSize: 14,
        fontWeight: '500',
    },
    consumablesSection: {
        marginTop: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 15,
        color: '#000',
        textAlign: 'center',
        textTransform: 'uppercase',

    },
    itemLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    consumableInputsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
        gap: 8,
    },
    inputColumn: {
        flex: 1,
    },
    columnLabel: {
        textAlign: 'center',
        padding: 5,
        fontSize: 12,
        color: '#000',
        marginBottom: 4,
    },
    consumableInput: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        paddingHorizontal: 8,
        backgroundColor: '#fff',
        textAlign: 'center',
    },
    addRowButton: {
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        backgroundColor: '#FFD700',
        borderWidth: 1,
        borderColor: '#000',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
    },
    addRowButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        letterSpacing: 0.5,
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
    modalView: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pickerWindow: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '80%',
        maxHeight: '70%',
    },
    pickerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingBottom: 10,
    },
    pickerTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    closeButton: {
        padding: 5,
    },
    closeButtonText: {
        fontSize: 16,
        color: '#007AFF',
    },
    itemButton: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    itemButtonText: {
        fontSize: 16,
    },
    selectedItemText: {
        padding: 10,
        fontSize: 16,
        color: '#000',
    },
    dropdownTrigger: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        backgroundColor: '#fff',
        padding: 10,
        marginBottom: 15,
    },
    dropdownArrow: {
        fontSize: 18,
        color: '#666',
    },
    consumableRowContainer: {
        marginBottom: 20,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    consumableRowHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    removeRowButton: {
        padding: 8,
        bottom:10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    removeRowButtonText: {
        color: '#FF3B30',
        fontSize: 20,
        fontWeight: '600',
    },
    dateFieldText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
        flex: 1,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 10,
    },
    datePickerContainer: {
        borderRadius: 8,
        paddingHorizontal: 20,
        paddingVertical: 10,
        flex: 1,
    },
    customInputContainer: {
        padding: 15,
    },
    customItemInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 15,
        backgroundColor: '#fff',
        color: '#000',
    },
    submitButton: {
        backgroundColor: '#FFD700',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#000',
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    signatureContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        marginTop: 10,
    },
    signatureLabelText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    signatureButton: {
        backgroundColor: '#FFD700',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 6,
        borderWidth: 1,
        borderColor: '#000',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        width: '40%',
    },
    signatureButtonText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#000',
        textAlign: 'center',
        letterSpacing: 0.5,
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
    signatureModalContainer: {
        flex: 1,
        backgroundColor: '#FFF',
        marginTop: 50,
        position: 'relative',
        height: '100%',
    },
    signatureCanvasContainer: {
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
        marginBottom: 15
    },
    confirmButton: {
        backgroundColor: '#FFD700',
        borderColor: '#000',
        marginBottom: 15
    },
    modalButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
});

const AddInvoiceForm = () => {
    console.log('AddInvoiceForm component rendering');
    
    const navigation = useNavigation();
    const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
    const { idToken, userAttributes } = useAppSelector((state) => {
        console.log('Auth selector called, current idToken:', !!idToken);
        return state.auth;
    });
    const dispatch = useAppDispatch();
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [formDate, setFormDate] = useState(new Date());
    const [formattedDate, setFormattedDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0]; // This will give 'YYYY-MM-DD' format
    });
    const [showSignatureModal, setShowSignatureModal] = useState(false);

    // Initialize spooler name once
    useEffect(() => {
        console.log('Name initialization effect running');
        if (idToken) {
            try {
                const decodedToken = jwtDecode(idToken);
                const name = decodedToken.name || userAttributes?.name || '';
                setSpoolerName(name);
            } catch (error) {
                console.error('Error decoding token:', error);
                Alert.alert('Error', 'Failed to load user information');
            }
        }
    }, [idToken, userAttributes?.name]);

    const [nextRowId, setNextRowId] = useState(1);

    const [activePickerRow, setActivePickerRow] = useState(null);
    const [customItemInput, setCustomItemInput] = useState('');
    const [showCustomItemInput, setShowCustomItemInput] = useState(false);
    const [signatureDataUrl, setSignatureDataUrl] = useState('');
    const signatureRef = useRef(null);
    const consumableItems = [
        'Mileage',
        'Overnight Stay',
        '2 3/8 - 2 7/8 Monel Bands',
        '3 1/2 Monel Bands',
        '2 7/8 Stainless Steel',
        '3 1/2 Stainless Steel',
        '2 3/8 - 2 7/8 Zeron Bands',
        '3 1/2 Zeron Bands',
        'Cable Splice Lead To Lead',
        'Cable Repair',
        'Band Cutters',
        'Cannon Clamp Tool Fee',
        'Cannon Clamp Install Fee',
        'Zero Banding Gun Tool Fee',
        'Pressure Text on Location',
        'Unit Fee Per Day',
        'CT Kit Installs (Fittings)',
        'CT Kit Pulls (Fittings)',
        'Surface Manifold',
        'Check Valve',
        '2 3/8s (Internal/External Mandrel)',
        '2 7/8s (Internal/External Mandrel)',
        '1/4 2205 CT Per Foot',
        '3/8s 2205 CT Per Foot',
        'Other'
    ];

    const backgroundImage = isDarkMode
    ? require('../../../assets/DarkMode.jpg')
    : require('../../../assets/LightMode.jpg')

    const [isPickerVisible, setPickerVisible] = useState(false);

    // State Variables For Input Fields
    const [workTicketID, setWorkTicketID] = useState('');
    const [spoolerName, setSpoolerName] = useState('');
    const [workType, setWorkType] = useState('');
    const [cableCompany, setCableCompany] = useState('');
    const [cableCompanyLocation, setCableCompanyLocation] = useState('');
    const [oilCompany, setOilCompany] = useState('');
    const [wellNumber, setWellNumber] = useState('');
    const [wellName, setWellName] = useState('');
    const [laborCosts, setLaborCosts] = useState({
        loadUnload: { rate: '', qty: '', amount: '' },
        spoolerMiles: { rate: '', qty: '', amount: '' },
        travelTime: { rate: '', qty: '', amount: '' },
        standbyTime: { rate: '', qty: '', amount: '' },
        spoolerLabor: { rate: '', qty: '', amount: '' },
    });
    const [mainJobType, setMainJobType] = useState(''); // 'install' or 'pull'
    const [additionalJobTypes, setAdditionalJobTypes] = useState({
        gasLift: false,
        gasInstall: false,
        ctSpooler: false,
        cableSpooler: false,
        comboSpooler: false,
        technicianLaydown: false,
    });
    const [consumableRows, setConsumableRows] = useState([
        { id: 0, item: '', qty: '', rate: '', amount: '' }
    ]);
    const [notes, setNotes] = useState('');
    const [cableLength, setCableLength] = useState('');
    const [cableType, setCableType] = useState('');
    const [reelNumber, setReelNumber] = useState('');
    const [extraCharges, setExtraCharges] = useState('');
    const [totalAmount, setTotalAmount] = useState(0);
    const [signature, setSignature] = useState(null);


    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || formDate;
        if (Platform.OS === 'android') {
            setShowDatePicker(false);
        }
        if (selectedDate) {
            setFormDate(currentDate);
            setFormattedDate(currentDate.toISOString().split('T')[0]);
        }
    };

    const updateLaborCost = (section, field, value) => {
        const newLaborCosts = { ...laborCosts };
        newLaborCosts[section][field] = value;

        if (field === 'rate' || field === 'qty') {
            const rate = field === 'rate' ? parseFloat(value) : parseFloat(newLaborCosts[section].rate);
            const qty = field === 'qty' ? parseFloat(value) : parseFloat(newLaborCosts[section].qty);
            
            if (!isNaN(rate) && !isNaN(qty)) {
                newLaborCosts[section].amount = (rate * qty).toFixed(2);
            }
        }

        setLaborCosts(newLaborCosts);
    };

    const updateConsumable = (rowId, field, value) => {
        setConsumableRows(currentRows => {
            return currentRows.map(row => {
                if (row.id === rowId) {
                    const updatedRow = { ...row, [field]: value };
                    
                    // Calculate amount if both rate and qty are present
                    if (field === 'rate' || field === 'qty') {
                        const rate = field === 'rate' ? parseFloat(value) : parseFloat(row.rate);
                        const qty = field === 'qty' ? parseFloat(value) : parseFloat(row.qty);
                        
                        if (!isNaN(rate) && !isNaN(qty)) {
                            updatedRow.amount = (rate * qty).toFixed(2);
                        }
                    }

                    // If selecting "Other", show custom input modal
                    if (field === 'item' && value === 'Other') {
                        setActivePickerRow(rowId);
                        setShowCustomItemInput(true);
                    }
                    
                    return updatedRow;
                }
                return row;
            });
        });
    };

    const handleCustomItemSubmit = () => {
        if (customItemInput.trim()) {
            setConsumableRows(currentRows => {
                return currentRows.map(row => {
                    if (row.id === activePickerRow) {
                        return { ...row, item: customItemInput.trim() };
                    }
                    return row;
                });
            });
            setCustomItemInput('');
            setShowCustomItemInput(false);
        }
    };

    const addConsumableRow = () => {
        const newRow = {
            id: nextRowId,
            item: '',
            qty: '',
            rate: '',
            amount: ''
        };
        setNextRowId(prevId => prevId + 1);
        setConsumableRows(prevRows => [...prevRows, newRow]);
    };

    const removeConsumableRow = (rowId) => {
        setConsumableRows(currentRows => currentRows.filter(row => row.id !== rowId));
    };

    // Calculate total amount whenever relevant values change
    useEffect(() => {
        const calculateTotal = () => {
            // Sum up labor costs
            const laborTotal = Object.values(laborCosts).reduce((sum, item) => {
                const amount = parseFloat(item.amount) || 0;
                return sum + amount;
            }, 0);

            // Sum up consumables
            const consumablesTotal = consumableRows.reduce((sum, row) => {
                const amount = parseFloat(row.amount) || 0;
                return sum + amount;
            }, 0);

            // Add extra charges
            const extraChargesAmount = parseFloat(extraCharges) || 0;

            // Calculate final total
            const finalTotal = laborTotal + consumablesTotal + extraChargesAmount;
            
            // Update total amount state with 2 decimal places
            setTotalAmount(finalTotal.toFixed(2));
        };

        calculateTotal();
    }, [laborCosts, consumableRows, extraCharges]);

    useEffect(() => {
        fetchWorkTicketID();
    }, []);

    const handleSignature = (signatureResult) => {
        const base64Data = signatureResult.replace('data:image/png;base64,', '');
        setSignature(base64Data);
        setSignatureDataUrl(signatureResult);
        setShowSignatureModal(false);
    };

    const handleEditSignature = () => {
        if (signature) {
            setSignatureDataUrl(`data:image/png;base64,${signature}`);
        }
        setShowSignatureModal(true);
    };

    const handleClear = () => {
        signatureRef.current?.clearSignature();
    }

    const handleConfirm = () => {
        signatureRef.current?.readSignature();
    }

    const fetchWorkTicketID = async () => {
        try {
            console.log('Fetching Work Ticket ID from:', endpoints.generateWorkTicketID);
            const response = await fetch(endpoints.generateWorkTicketID, {
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
                console.error('Failed to generate Work Ticket ID (AddInvoiceForm.js):', data.error || 'No workTicketID in response');
            }
        } catch (error) {
            console.error('Error fetching Work Ticket ID (AddInvoiceForm.js):', error.message);
            console.error('Full error:', error);
        }
    };

    const handleSubmit = async () => {
        try {
            // Transform labor costs into the required format
            const formattedLaborCosts = [
                {
                    type: 'Load/Unload',
                    rate: Number(laborCosts.loadUnload.rate) || 0,
                    qty: Number(laborCosts.loadUnload.qty) || 0,
                    amount: Number(laborCosts.loadUnload.amount) || 0
                },
                {
                    type: 'Spooler Miles',
                    rate: Number(laborCosts.spoolerMiles.rate) || 0,
                    qty: Number(laborCosts.spoolerMiles.qty) || 0,
                    amount: Number(laborCosts.spoolerMiles.amount) || 0
                },
                {
                    type: 'Travel Time',
                    rate: Number(laborCosts.travelTime.rate) || 0,
                    qty: Number(laborCosts.travelTime.qty) || 0,
                    amount: Number(laborCosts.travelTime.amount) || 0
                },
                {
                    type: 'Standby Time',
                    rate: Number(laborCosts.standbyTime.rate) || 0,
                    qty: Number(laborCosts.standbyTime.qty) || 0,
                    amount: Number(laborCosts.standbyTime.amount) || 0
                },
                {
                    type: 'Spooler Labor',
                    rate: Number(laborCosts.spoolerLabor.rate) || 0,
                    qty: Number(laborCosts.spoolerLabor.qty) || 0,
                    amount: Number(laborCosts.spoolerLabor.amount) || 0
                }
            ];

            // Format consumables data - ensure all fields are properly formatted
            const formattedConsumables = consumableRows.map(row => ({
                item: row.item || '',
                qty: parseFloat(row.qty) || 0,
                rate: parseFloat(row.rate) || 0,
                amount: parseFloat(row.amount) || 0
            })).filter(row => row.item); // Only include rows with an item selected

            // Format job types
            const jobTypes = [
                mainJobType,
                ...Object.entries(additionalJobTypes)
                    .filter(([_, isSelected]) => isSelected)
                    .map(([type]) => type)
            ];

            // Create the request body according to the schema
            const formData = {
                WorkTicketID: workTicketID,
                InvoiceDate: formattedDate,
                Spooler: spoolerName,
                WorkType: workType,
                CableCompany: cableCompany,
                CableCompanyLocation: cableCompanyLocation,
                OilCompany: oilCompany,
                WellNumber: Number(wellNumber) || 0,
                WellNumberName: wellName,
                LaborCosts: formattedLaborCosts,
                JobType: jobTypes,
                Consumables: formattedConsumables,
                Notes: notes,
                CableLength: Number(cableLength) || 0,
                CableType: cableType,
                ReelNumber: reelNumber,
                ExtraCharges: Number(extraCharges) || 0,
                InvoiceTotal: Number(totalAmount) || 0,
                CustomerSignature: signature || '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                _lastChangedAt: new Date().toISOString(),
                _version: 1,
                _typename: 'Invoice Form'
            };

            // Make the API call
            const response = await fetch(endpoints.createInvoiceForm, {
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
                'Invoice form has been created successfully!',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.navigate('Forms')
                    }
                ]
            );

        } catch (error) {
            console.error('Error submitting form:', error);
            Alert.alert(
                'Error',
                `Failed to submit the form: ${error.message}. Please try again.`,
                [
                    {
                        text: 'OK'
                    }
                ]
            );
        }
    };

    // Add cleanup hook
    useScreenCleanup(() => {
        // Clean up resources when screen loses focus
        if (signatureRef.current) {
            signatureRef.current.clearSignature();
        }
        setShowDatePicker(false);
        setShowSignatureModal(false);
        setShowCustomItemInput(false);
        setPickerVisible(false);
        
        // Reset form state if needed
        setConsumableRows([{ id: 0, item: '', qty: '', rate: '', amount: '' }]);
        setNextRowId(1);
        setActivePickerRow(null);
        setCustomItemInput('');
        
        // Clean up any active keyboard
        Keyboard.dismiss();
    });

    return(
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
                                    Add New Invoice Form
                                </Text>
                                <TouchableOpacity
                                    style={styles.goBackButton}
                                    onPress={() => (navigation.goBack())}
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
                            {/** FORM SECTION */}
                            <Card isDarkMode={isDarkMode}>
                                <View style={styles.cardContainerContent}>

                                {/**Work Ticket ID Input */}
                                <View  style={styles.inputContainer}>
                                    <Text style={[styles.fieldText, {color: isDarkMode ? '#fff' : '#000'}]}>
                                        Work Ticket ID:
                                    </Text>
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

                                {/* Order Date Input */}
                                <View style={styles.dateContainer}>
                                    <Text style={[styles.dateFieldText, {color: isDarkMode ? '#fff' : '#000'}]}>
                                        Invoice Date:
                                    </Text>
                                    <View style={styles.datePickerContainer}>
                                        {Platform.OS === 'android' ? (
                                            <>
                                                <TouchableOpacity 
                                                    onPress={() => setShowDatePicker(true)}
                                                    style={styles.inputField}
                                                >
                                                    <Text style={styles.inputText}>
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

                                {/** Spooler Input */}
                                <View style={styles.inputContainer}>
                                    <Text style={[styles.fieldText, {color: isDarkMode ? '#fff' : '#000'}]}>
                                        Spooler:
                                    </Text>
                                    <View style={styles.inputField}>
                                        <TextInput
                                            style={styles.inputText}
                                            placeholder="Enter Spooler Name"
                                            placeholderTextColor={'#000'}
                                            value={spoolerName}
                                            editable={false}
                                            onChangeText={setSpoolerName}
                                        />
                                    </View>
                                </View>

                                {/** Work Type Input */}
                                <View style={styles.inputContainer}>
                                    <Text style={[styles.fieldText, { color: isDarkMode ? '#fff' : '#000'}]}>
                                        Work Type:
                                    </Text>
                                    <View style={styles.inputField}>
                                        <TextInput
                                            style={styles.inputText}
                                            placeholder='Enter Work Type'
                                            placeholderTextColor={'#000'}
                                            value={workType}
                                            onChangeText={setWorkType}
                                        />
                                    </View>
                                </View>

                                {/**Cable Company Input */}
                                <View style={styles.inputContainer}>
                                    <Text style={[styles.fieldText,{ color: isDarkMode ? '#fff' : '#000'}]}>
                                        Cable Company:
                                    </Text>
                                    <View style={styles.inputField}>
                                        <TextInput
                                            style={styles.inputText}
                                            placeholder='Enter Cable Company'
                                            placeholderTextColor={'#000'}
                                            value={cableCompany}
                                            onChangeText={setCableCompany}
                                        />
                                    </View>
                                </View>

                                {/**Cable Company Location Input*/}
                                <View style={styles.inputContainer}>
                                    <Text style={[styles.fieldText, {color: isDarkMode ? '#fff' : '#000'}]}>
                                        Cable Company Location:
                                    </Text>
                                    <View style={styles.inputField}>
                                        <TextInput
                                            style={styles.inputText}
                                            placeholder='Enter Cable Company Location'
                                            placeholderTextColor={'#000'}
                                            value={cableCompanyLocation}
                                            onChangeText={setCableCompanyLocation}
                                        />
                                    </View>
                                </View>

                                {/**Oil Company Input*/}
                                <View style={styles.inputContainer}>
                                    <Text style={[styles.fieldText, { color: isDarkMode ? '#fff' : '#000'}]}>
                                        Oil Company:
                                    </Text>
                                    <View style={styles.inputField}>
                                        <TextInput
                                            style={styles.inputText}
                                            placeholder='Enter Oil Company'
                                            placeholderTextColor={'#000'}
                                            value={oilCompany}
                                            onChangeText={setOilCompany}
                                        />
                                    </View>
                                </View>

                                {/**Well Number Input*/}
                                <View style={styles.inputContainer}>
                                    <Text style={[styles.fieldText, { color: isDarkMode ? '#fff' : '#000'}]}>
                                        Well Number:    
                                    </Text>
                                    <View style={styles.inputField}>
                                        <TextInput
                                            style={styles.inputText}
                                            placeholder='Enter Well Number'
                                            placeholderTextColor={'#000'}
                                            keyboardType='numeric'
                                            value={wellNumber}
                                            onChangeText={setWellNumber}
                                        />
                                    </View>
                                </View>

                                {/**Well Name Input*/}
                                <View style={styles.inputContainer}>
                                    <Text style={[styles.fieldText, { color: isDarkMode ? '#fff' : '#000'}]}>
                                        Well Name:
                                    </Text>
                                    <View style={styles.inputField}>
                                        <TextInput
                                            style={styles.inputText}
                                            placeholder='Enter Well Name'
                                            placeholderTextColor={'#000'}
                                            value={wellName}
                                            onChangeText={setWellName}
                                        />
                                    </View>
                                </View>

                                {/** Labor Costs Input*/}
                                <View style={styles.laborSection}>
                                    <Text style={[styles.laborSectionTitle, { color: isDarkMode ? '#fff' : '#000' }]}>
                                        Labor Costs
                                    </Text>

                                    {/* Load/Unload */}
                                    <View style={styles.laborRow}>
                                        <View style={styles.laborRowHeader}>
                                            <Text style={[styles.laborLabel, { color: isDarkMode ? '#fff' : '#000' }]}>
                                                Load/Unload:
                                            </Text>
                                        </View>
                                        <View style={styles.laborInputsContainer}>
                                            <View style={styles.laborInputWrapper}>
                                            <Text style={[styles.columnLabel, { color: isDarkMode ? '#fff' : '#000' }]}>
                                                        Rate
                                            </Text>
                                                <TextInput
                                                    style={[styles.laborInput, { color: '#000' }]}
                                                    keyboardType="decimal-pad"
                                                    placeholder="$0.00"
                                                    placeholderTextColor={isDarkMode ? '#666' : '#aaa'}
                                                    value={laborCosts.loadUnload.rate}
                                                    onChangeText={(value) => updateLaborCost('loadUnload', 'rate', value)}
                                                />
                                            </View>
                                            <View style={styles.laborInputWrapper}>
                                            <Text style={[styles.columnLabel, { color: isDarkMode ? '#fff' : '#000' }]}>
                                                        QTY
                                            </Text>
                                                <TextInput
                                                    style={[styles.laborInput, { color: '#000' }]}
                                                    keyboardType="decimal-pad"
                                                    placeholder="Hours:"
                                                    placeholderTextColor={isDarkMode ? '#666' : '#aaa'}
                                                    value={laborCosts.loadUnload.qty}
                                                    onChangeText={(value) => updateLaborCost('loadUnload', 'qty', value)}
                                                />
                                            </View>
                                            <View style={styles.laborInputWrapper}>
                                            <Text style={[styles.columnLabel, { color: isDarkMode ? '#fff' : '#000' }]}>
                                                        Amount
                                            </Text>
                                                <TextInput
                                                    style={[styles.laborInput, { color: '#000' }]}
                                                    editable={false}
                                                    value={laborCosts.loadUnload.amount}
                                                    placeholder="$0.00"
                                                    placeholderTextColor={isDarkMode ? '#666' : '#aaa'}
                                                />
                                            </View>
                                        </View>
                                    </View>

                                    {/* Spooler Miles To */}
                                    <View style={styles.laborRow}>
                                        <View style={styles.laborRowHeader}>
                                            <Text style={[styles.laborLabel, { color: isDarkMode ? '#fff' : '#000' }]}>
                                                Spooler Miles To:
                                            </Text>
                                        </View>
                                        <View style={styles.laborInputsContainer}>
                                            <View style={styles.laborInputWrapper}>
                                            <Text style={[styles.columnLabel, { color: isDarkMode ? '#fff' : '#000' }]}>
                                                        Rate
                                            </Text>
                                                <TextInput
                                                    style={[styles.laborInput, { color: '#000' }]}
                                                    keyboardType="decimal-pad"
                                                    placeholder="$0.00"
                                                    placeholderTextColor={isDarkMode ? '#666' : '#aaa'}
                                                    value={laborCosts.spoolerMiles.rate}
                                                    onChangeText={(value) => updateLaborCost('spoolerMiles', 'rate', value)}
                                                />
                                            </View>
                                            <View style={styles.laborInputWrapper}>
                                            <Text style={[styles.columnLabel, { color: isDarkMode ? '#fff' : '#000' }]}>
                                                        QTY
                                            </Text>
                                                <TextInput
                                                    style={[styles.laborInput, { color: '#000' }]}
                                                    keyboardType="decimal-pad"
                                                    placeholder="Miles:"
                                                    placeholderTextColor={isDarkMode ? '#666' : '#aaa'}
                                                    value={laborCosts.spoolerMiles.qty}
                                                    onChangeText={(value) => updateLaborCost('spoolerMiles', 'qty', value)}
                                                />
                                            </View>
                                            <View style={styles.laborInputWrapper}>
                                            <Text style={[styles.columnLabel, { color: isDarkMode ? '#fff' : '#000' }]}>
                                                        Amount
                                            </Text>
                                                <TextInput
                                                    style={[styles.laborInput, { color: '#000' }]}
                                                    editable={false}
                                                    value={laborCosts.spoolerMiles.amount}
                                                    placeholder="$0.00"
                                                    placeholderTextColor={isDarkMode ? '#666' : '#aaa'}
                                                />
                                            </View>
                                        </View>
                                    </View>

                                    {/* Travel Time */}
                                    <View style={styles.laborRow}>
                                        <View style={styles.laborRowHeader}>
                                            <Text style={[styles.laborLabel, { color: isDarkMode ? '#fff' : '#000' }]}>
                                                Travel Time:
                                            </Text>
                                        </View>
                                        <View style={styles.laborInputsContainer}>
                                            <View style={styles.laborInputWrapper}>
                                            <Text style={[styles.columnLabel, { color: isDarkMode ? '#fff' : '#000' }]}>
                                                        Rate
                                            </Text>
                                                <TextInput
                                                    style={[styles.laborInput, { color: '#000' }]}
                                                    keyboardType="decimal-pad"
                                                    placeholder="$0.00"
                                                    placeholderTextColor={isDarkMode ? '#666' : '#aaa'}
                                                    value={laborCosts.travelTime.rate}
                                                    onChangeText={(value) => updateLaborCost('travelTime', 'rate', value)}
                                                />
                                            </View>
                                            <View style={styles.laborInputWrapper}>
                                            <Text style={[styles.columnLabel, { color: isDarkMode ? '#fff' : '#000' }]}>
                                                        QTY
                                            </Text>
                                                <TextInput
                                                    style={[styles.laborInput, { color: '#000' }]}
                                                    keyboardType="decimal-pad"
                                                    placeholder="Hours:"
                                                    placeholderTextColor={isDarkMode ? '#666' : '#aaa'}
                                                    value={laborCosts.travelTime.qty}
                                                    onChangeText={(value) => updateLaborCost('travelTime', 'qty', value)}
                                                />
                                            </View>
                                            <View style={styles.laborInputWrapper}>
                                            <Text style={[styles.columnLabel, { color: isDarkMode ? '#fff' : '#000' }]}>
                                                        Amount
                                            </Text>
                                                <TextInput
                                                    style={[styles.laborInput, { color: '#000' }]}
                                                    editable={false}
                                                    value={laborCosts.travelTime.amount}
                                                    placeholder="$0.00"
                                                    placeholderTextColor={isDarkMode ? '#666' : '#aaa'}
                                                />
                                            </View>
                                        </View>
                                    </View>

                                    {/* Standby Time */}
                                    <View style={styles.laborRow}>
                                        <View style={styles.laborRowHeader}>
                                            <Text style={[styles.laborLabel, { color: isDarkMode ? '#fff' : '#000' }]}>
                                                Standby Time:
                                            </Text>
                                        </View>
                                        <View style={styles.laborInputsContainer}>
                                            <View style={styles.laborInputWrapper}>
                                            <Text style={[styles.columnLabel, { color: isDarkMode ? '#fff' : '#000' }]}>
                                                        Rate
                                            </Text>
                                                <TextInput
                                                    style={[styles.laborInput, { color: '#000' }]}
                                                    keyboardType="decimal-pad"
                                                    placeholder="$0.00"
                                                    placeholderTextColor={isDarkMode ? '#666' : '#aaa'}
                                                    value={laborCosts.standbyTime.rate}
                                                    onChangeText={(value) => updateLaborCost('standbyTime', 'rate', value)}
                                                />
                                            </View>
                                            <View style={styles.laborInputWrapper}>
                                            <Text style={[styles.columnLabel, { color: isDarkMode ? '#fff' : '#000' }]}>
                                                        QTY
                                            </Text>
                                                <TextInput
                                                    style={[styles.laborInput, { color: '#000' }]}
                                                    keyboardType="decimal-pad"
                                                    placeholder="Hours:"
                                                    placeholderTextColor={isDarkMode ? '#666' : '#aaa'}
                                                    value={laborCosts.standbyTime.qty}
                                                    onChangeText={(value) => updateLaborCost('standbyTime', 'qty', value)}
                                                />
                                            </View>
                                            <View style={styles.laborInputWrapper}>
                                            <Text style={[styles.columnLabel, { color: isDarkMode ? '#fff' : '#000' }]}>
                                                        Amount
                                            </Text>
                                                <TextInput
                                                    style={[styles.laborInput, { color: '#000' }]}
                                                    editable={false}
                                                    value={laborCosts.standbyTime.amount}
                                                    placeholder="$0.00"
                                                    placeholderTextColor={isDarkMode ? '#666' : '#aaa'}
                                                />
                                            </View>
                                        </View>
                                    </View>

                                    {/* Spooler Labor */}
                                    <View style={styles.laborRow}>
                                        <View style={styles.laborRowHeader}>
                                            <Text style={[styles.laborLabel, { color: isDarkMode ? '#fff' : '#000' }]}>
                                                Spooler Labor:
                                            </Text>
                                        </View>
                                        <View style={styles.laborInputsContainer}>
                                            <View style={styles.laborInputWrapper}>
                                            <Text style={[styles.columnLabel, { color: isDarkMode ? '#fff' : '#000' }]}>
                                                        Rate
                                            </Text>
                                                <TextInput
                                                    style={[styles.laborInput, { color: '#000' }]}
                                                    keyboardType="decimal-pad"
                                                    placeholder="$0.00"
                                                    placeholderTextColor={isDarkMode ? '#666' : '#aaa'}
                                                    value={laborCosts.spoolerLabor.rate}
                                                    onChangeText={(value) => updateLaborCost('spoolerLabor', 'rate', value)}
                                                />
                                            </View>
                                            <View style={styles.laborInputWrapper}>
                                            <Text style={[styles.columnLabel, { color: isDarkMode ? '#fff' : '#000' }]}>
                                                        QTY
                                            </Text>
                                                <TextInput
                                                    style={[styles.laborInput, { color: '#000' }]}
                                                    keyboardType="decimal-pad"
                                                    placeholder="Hours:"
                                                    placeholderTextColor={isDarkMode ? '#666' : '#aaa'}
                                                    value={laborCosts.spoolerLabor.qty}
                                                    onChangeText={(value) => updateLaborCost('spoolerLabor', 'qty', value)}
                                                />
                                            </View>
                                            <View style={styles.laborInputWrapper}>
                                            <Text style={[styles.columnLabel, { color: isDarkMode ? '#fff' : '#000' }]}>
                                                        Amount
                                            </Text>
                                                <TextInput
                                                    style={[styles.laborInput, { color: '#000' }]}
                                                    editable={false}
                                                    value={laborCosts.spoolerLabor.amount}
                                                    placeholder="$0.00"
                                                    placeholderTextColor={isDarkMode ? '#666' : '#aaa'}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                {/** Job Type Section */}
                                <View style={styles.jobTypeSection}>
                                    <Text style={[styles.jobTypeSectionTitle, { color: isDarkMode ? '#fff' : '#000' }]}>
                                        Job Type
                                    </Text>

                                    {/* Main Job Type Selection */}
                                    <View style={styles.mainJobTypeContainer}>
                                        {/* Install Radio Button */}
                                        <TouchableOpacity 
                                            style={styles.radioContainer}
                                            onPress={() => setMainJobType('install')}
                                        >
                                            <View style={[
                                                styles.radioButton,
                                                { borderColor: isDarkMode ? '#fff' : '#000' }
                                            ]}>
                                                {mainJobType === 'install' && (
                                                    <View style={[
                                                        styles.radioSelected,
                                                        { backgroundColor: isDarkMode ? '#fff' : '#000' }
                                                    ]} />
                                                )}
                                            </View>
                                            <Text style={[
                                                styles.radioLabel,
                                                { color: isDarkMode ? '#fff' : '#000' }
                                            ]}>
                                                Install
                                            </Text>
                                        </TouchableOpacity>

                                        {/* Pull Radio Button */}
                                        <TouchableOpacity 
                                            style={styles.radioContainer}
                                            onPress={() => setMainJobType('pull')}
                                        >
                                            <View style={[
                                                styles.radioButton,
                                                { borderColor: isDarkMode ? '#fff' : '#000' }
                                            ]}>
                                                {mainJobType === 'pull' && (
                                                    <View style={[
                                                        styles.radioSelected,
                                                        { backgroundColor: isDarkMode ? '#fff' : '#000' }
                                                    ]} />
                                                )}
                                            </View>
                                            <Text style={[
                                                styles.radioLabel,
                                                { color: isDarkMode ? '#fff' : '#000' }
                                            ]}>
                                                Pull
                                            </Text>
                                        </TouchableOpacity>
                                    </View>

                                    {/* Additional Job Types */}
                                    <View style={styles.additionalJobTypesContainer}>
                                        {/* Gas Lift */}
                                        <TouchableOpacity 
                                            style={styles.checkboxContainer}
                                            onPress={() => setAdditionalJobTypes(prev => ({
                                                ...prev,
                                                gasLift: !prev.gasLift
                                            }))}
                                        >
                                            <View style={[
                                                styles.checkbox,
                                                { borderColor: isDarkMode ? '#fff' : '#000' }
                                            ]}>
                                                {additionalJobTypes.gasLift && (
                                                    <Text style={{ color: isDarkMode ? '#fff' : '#000' }}>✓</Text>
                                                )}
                                            </View>
                                            <Text style={[
                                                styles.checkboxLabel,
                                                { color: isDarkMode ? '#fff' : '#000' }
                                            ]}>
                                                Gas Lift
                                            </Text>
                                        </TouchableOpacity>

                                        {/* Gas Install */}
                                        <TouchableOpacity 
                                            style={styles.checkboxContainer}
                                            onPress={() => setAdditionalJobTypes(prev => ({
                                                ...prev,
                                                gasInstall: !prev.gasInstall
                                            }))}
                                        >
                                            <View style={[
                                                styles.checkbox,
                                                { borderColor: isDarkMode ? '#fff' : '#000' }
                                            ]}>
                                                {additionalJobTypes.gasInstall && (
                                                    <Text style={{ color: isDarkMode ? '#fff' : '#000' }}>✓</Text>
                                                )}
                                            </View>
                                            <Text style={[
                                                styles.checkboxLabel,
                                                { color: isDarkMode ? '#fff' : '#000' }
                                            ]}>
                                                Gas Install
                                            </Text>
                                        </TouchableOpacity>

                                        {/* CT Spooler */}
                                        <TouchableOpacity 
                                            style={styles.checkboxContainer}
                                            onPress={() => setAdditionalJobTypes(prev => ({
                                                ...prev,
                                                ctSpooler: !prev.ctSpooler
                                            }))}
                                        >
                                            <View style={[
                                                styles.checkbox,
                                                { borderColor: isDarkMode ? '#fff' : '#000' }
                                            ]}>
                                                {additionalJobTypes.ctSpooler && (
                                                    <Text style={{ color: isDarkMode ? '#fff' : '#000' }}>✓</Text>
                                                )}
                                            </View>
                                            <Text style={[
                                                styles.checkboxLabel,
                                                { color: isDarkMode ? '#fff' : '#000' }
                                            ]}>
                                                CT Spooler
                                            </Text>
                                        </TouchableOpacity>

                                        {/* Cable Spooler */}
                                        <TouchableOpacity 
                                            style={styles.checkboxContainer}
                                            onPress={() => setAdditionalJobTypes(prev => ({
                                                ...prev,
                                                cableSpooler: !prev.cableSpooler
                                            }))}
                                        >
                                            <View style={[
                                                styles.checkbox,
                                                { borderColor: isDarkMode ? '#fff' : '#000' }
                                            ]}>
                                                {additionalJobTypes.cableSpooler && (
                                                    <Text style={{ color: isDarkMode ? '#fff' : '#000' }}>✓</Text>
                                                )}
                                            </View>
                                            <Text style={[
                                                styles.checkboxLabel,
                                                { color: isDarkMode ? '#fff' : '#000' }
                                            ]}>
                                                Cable Spooler
                                            </Text>
                                        </TouchableOpacity>

                                        {/* Combo Spooler */}
                                        <TouchableOpacity 
                                            style={styles.checkboxContainer}
                                            onPress={() => setAdditionalJobTypes(prev => ({
                                                ...prev,
                                                comboSpooler: !prev.comboSpooler
                                            }))}
                                        >
                                            <View style={[
                                                styles.checkbox,
                                                { borderColor: isDarkMode ? '#fff' : '#000' }
                                            ]}>
                                                {additionalJobTypes.comboSpooler && (
                                                    <Text style={{ color: isDarkMode ? '#fff' : '#000' }}>✓</Text>
                                                )}
                                            </View>
                                            <Text style={[
                                                styles.checkboxLabel,
                                                { color: isDarkMode ? '#fff' : '#000' }
                                            ]}>
                                                Combo Spooler
                                            </Text>
                                        </TouchableOpacity>

                                        {/* Technician Laydown */}
                                        <TouchableOpacity 
                                            style={styles.checkboxContainer}
                                            onPress={() => setAdditionalJobTypes(prev => ({
                                                ...prev,
                                                technicianLaydown: !prev.technicianLaydown
                                            }))}
                                        >
                                            <View style={[
                                                styles.checkbox,
                                                { borderColor: isDarkMode ? '#fff' : '#000' }
                                            ]}>
                                                {additionalJobTypes.technicianLaydown && (
                                                    <Text style={{ color: isDarkMode ? '#fff' : '#000' }}>✓</Text>
                                                )}
                                            </View>
                                            <Text style={[
                                                styles.checkboxLabel,
                                                { color: isDarkMode ? '#fff' : '#000' }
                                            ]}>
                                                Technician Laydown
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {/** Consumables Section */}
                                <View style={styles.consumablesSection}>
                                    <Text style={[styles.sectionTitle, { color: isDarkMode ? '#fff' : '#000' }]}>
                                        Consumables
                                    </Text>

                                    {consumableRows.map((row) => (
                                        <View key={row.id} style={styles.consumableRowContainer}>
                                            <View style={styles.consumableRowHeader}>
                                                <Text style={[styles.itemLabel, { color: isDarkMode ? '#fff' : '#000' }]}>
                                                    Item:
                                                </Text>
                                                {consumableRows.length > 1 && (
                                                    <TouchableOpacity 
                                                        onPress={() => removeConsumableRow(row.id)}
                                                        style={styles.removeRowButton}
                                                    >
                                                    <Text style={styles.removeRowButtonText}>×</Text>
                                                    </TouchableOpacity>
                                                )}
                                            </View>

                                            <TouchableOpacity 
                                                style={styles.dropdownTrigger}
                                                onPress={() => {
                                                    setActivePickerRow(row.id);
                                                    setPickerVisible(true);
                                                }}
                                            >
                                                <Text style={styles.selectedItemText}>
                                                    {row.item || 'Select Item'}
                                                </Text>
                                                <Text style={styles.dropdownArrow}>▼</Text>
                                            </TouchableOpacity>

                                            <View style={styles.consumableInputsRow}>
                                                <View style={styles.inputColumn}>
                                                    <Text style={[styles.columnLabel, { color: isDarkMode ? '#fff' : '#000' }]}>
                                                        QTY
                                                    </Text>
                                                    <TextInput
                                                        style={[styles.consumableInput, { color: '#000' }]}
                                                        keyboardType="decimal-pad"
                                                        placeholder="0"
                                                        placeholderTextColor={isDarkMode ? '#666' : '#aaa'}
                                                        value={row.qty}
                                                        onChangeText={(value) => updateConsumable(row.id, 'qty', value)}
                                                    />
                                                </View>
                                                <View style={styles.inputColumn}>
                                                    <Text style={[styles.columnLabel, { color: isDarkMode ? '#fff' : '#000' }]}>
                                                        Rate
                                                    </Text>
                                                    <TextInput
                                                        style={[styles.consumableInput, { color: '#000' }]}
                                                        keyboardType="decimal-pad"
                                                        placeholder="$0.00"
                                                        placeholderTextColor={isDarkMode ? '#666' : '#aaa'}
                                                        value={row.rate}
                                                        onChangeText={(value) => updateConsumable(row.id, 'rate', value)}
                                                    />
                                                </View>
                                                <View style={styles.inputColumn}>
                                                    <Text style={[styles.columnLabel, { color: isDarkMode ? '#fff' : '#000' }]}>
                                                        Amount
                                                    </Text>
                                                    <TextInput
                                                        style={[styles.consumableInput, { color: '#000' }]}
                                                        editable={false}
                                                        placeholder="$0.00"
                                                        placeholderTextColor={isDarkMode ? '#666' : '#aaa'}
                                                        value={row.amount}
                                                    />
                                                </View>
                                            </View>
                                        </View>
                                    ))}

                                    <Modal
                                        visible={isPickerVisible}
                                        transparent={true}
                                        animationType="fade"
                                        onRequestClose={() => setPickerVisible(false)}
                                    >
                                        <TouchableWithoutFeedback onPress={() => setPickerVisible(false)}>
                                            <View style={styles.modalView}>
                                                <TouchableWithoutFeedback>
                                                    <View style={styles.pickerWindow}>
                                                        <View style={styles.pickerHeader}>
                                                            <Text style={styles.pickerTitle}>Select Item</Text>
                                                            <TouchableOpacity 
                                                                style={styles.closeButton}
                                                                onPress={() => setPickerVisible(false)}
                                                            >
                                                                <Text style={styles.closeButtonText}>Done</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                        <ScrollView>
                                                            {consumableItems.map((item) => (
                                                                <TouchableOpacity
                                                                    key={item}
                                                                    style={styles.itemButton}
                                                                    onPress={() => {
                                                                        updateConsumable(activePickerRow, 'item', item);
                                                                        setPickerVisible(false);
                                                                    }}
                                                                >
                                                                    <Text style={[
                                                                        styles.itemButtonText,
                                                                        consumableRows.find(row => row.id === activePickerRow)?.item === item && { fontWeight: '600' }
                                                                    ]}>
                                                                        {item}
                                                                    </Text>
                                                                </TouchableOpacity>
                                                            ))}
                                                        </ScrollView>
                                                    </View>
                                                </TouchableWithoutFeedback>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    </Modal>

                                    <Modal
                                        visible={showCustomItemInput}
                                        transparent={true}
                                        animationType="fade"
                                        onRequestClose={() => setShowCustomItemInput(false)}
                                    >
                                        <TouchableWithoutFeedback onPress={() => setShowCustomItemInput(false)}>
                                            <View style={styles.modalView}>
                                                <TouchableWithoutFeedback>
                                                    <View style={styles.pickerWindow}>
                                                        <View style={styles.pickerHeader}>
                                                            <Text style={styles.pickerTitle}>Enter Custom Item</Text>
                                                            <TouchableOpacity 
                                                                style={styles.closeButton}
                                                                onPress={() => setShowCustomItemInput(false)}
                                                            >
                                                                <Text style={styles.closeButtonText}>Cancel</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                        <View style={styles.customInputContainer}>
                                                            <TextInput
                                                                style={styles.customItemInput}
                                                                value={customItemInput}
                                                                onChangeText={setCustomItemInput}
                                                                placeholder="Enter custom item name"
                                                                placeholderTextColor="#666"
                                                            />
                                                            <TouchableOpacity
                                                                style={[
                                                                    styles.submitButton,
                                                                    { opacity: customItemInput.trim() ? 1 : 0.5 }
                                                                ]}
                                                                onPress={handleCustomItemSubmit}
                                                                disabled={!customItemInput.trim()}
                                                            >
                                                                <Text style={styles.submitButtonText}>Submit</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                </TouchableWithoutFeedback>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    </Modal>

                                    <TouchableOpacity
                                        style={styles.addRowButton}
                                        onPress={addConsumableRow}
                                    >
                                        <Text style={styles.addRowButtonText}>
                                            Add Row
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                {/** Notes Section */}
                                <View style={styles.inputContainer}>
                                    <Text style={[styles.fieldText, { color: isDarkMode ? '#fff' : '#000'}]}>
                                        Notes:
                                    </Text>
                                    <View style={styles.inputNotesField}>
                                        <TextInput
                                            style={[styles.inputText, { color: '#000'}]}
                                            placeholder="Enter notes"
                                            placeholderTextColor={'#000'}
                                            multiline={true}
                                            numberOfLines={4}
                                            textAlignVertical="top"
                                            value={notes}
                                            onChangeText={setNotes}
                                        />
                                    </View>
                                </View>

                                {/** Cable Length Input */}
                                <View style={styles.inputContainer}>
                                    <Text style={[styles.fieldText, { color: isDarkMode ? '#fff' : '#000'}]}>   
                                        Cable Length (ft):
                                    </Text>
                                    <View style={styles.inputField}>
                                        <TextInput
                                            style={[styles.inputText, { color: '#000'}]}
                                            keyboardType='numeric'
                                            placeholder='Enter Cable Length'
                                            placeholderTextColor={'#000'}
                                            value={cableLength}
                                            onChangeText={setCableLength}
                                        />
                                    </View>
                                </View>

                                {/** Cable Type Input */}
                                <View style={styles.inputContainer}>
                                    <Text style={[styles.fieldText, { color: isDarkMode ? '#fff' : '#000'}]}>
                                        Cable Type:
                                    </Text>
                                    <View style={styles.inputField}>
                                        <TextInput
                                            style={[styles.inputText, { color: '#000'}]}
                                            placeholder='Enter Cable Type'
                                            placeholderTextColor={'#000'}
                                            value={cableType}
                                            onChangeText={setCableType}
                                        />
                                    </View>
                                </View>

                                {/** Reel Number Input */}
                                <View style={styles.inputContainer}>
                                    <Text style={[styles.fieldText, { color: isDarkMode ? '#fff' : '#000'}]}>
                                        Reel Number:
                                    </Text>
                                    <View style={styles.inputField}>
                                        <TextInput
                                            style={[styles.inputText, { color: '#000'}]}
                                            placeholder='Enter Reel Number'
                                            placeholderTextColor={'#000'}
                                            keyboardType='numeric'
                                            value={reelNumber}
                                            onChangeText={setReelNumber}
                                        />
                                    </View>
                                </View>

                                {/** Extra Charges Section */}
                                <View style={styles.inputContainer}>
                                    <Text style={[styles.fieldText, { color: isDarkMode ? '#fff' : '#000'}]}>
                                        Extra Charges:
                                    </Text>
                                    <View style={styles.inputField}>
                                        <TextInput
                                            style={[styles.inputText, { color: '#000'}]}
                                            placeholder='Enter Extra Charges'
                                            placeholderTextColor={'#000'}
                                            keyboardType='numeric'
                                            value={extraCharges}
                                            onChangeText={setExtraCharges}
                                        />
                                    </View>
                                </View>

                                {/** Total Amount Input */}
                                <View style={styles.inputContainer}>
                                    <Text style={[styles.fieldText, { color: isDarkMode ? '#fff' : '#000'}]}>
                                        Total Amount:
                                    </Text>
                                    <View style={styles.inputField}>
                                        <TextInput
                                            style={[styles.inputText, { color: '#000'}]}
                                            editable={false}
                                            value={`$${totalAmount}`}
                                            placeholder="$0.00"
                                            placeholderTextColor={'#000'}
                                            onChangeText={setTotalAmount}
                                        />
                                    </View>
                                </View>

                                {/** Customer Signature Input */}
                                <View style={styles.signatureContainer}>
                                    <Text style={[styles.signatureLabelText, { color: isDarkMode ? '#fff' : '#000'}]}>
                                        Customer Signature:
                                    </Text>
                                    <TouchableOpacity
                                        style={styles.signatureButton}
                                        onPress={handleEditSignature}
                                        accessibilityRole="button"
                                        accessibilityLabel="Draw signature"
                                    >
                                        <Text style={styles.signatureButtonText}>
                                            {signature ? 'Edit Signature' : 'Add Signature'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                {/** Finish Button */}
                                <TouchableOpacity
                                style={[styles.finishButton, { borderColor: '#000' }]}
                                onPress={() => {
                                    handleSubmit();
                                }}
                                accessibilityRole="button"
                                accessibilityLabel="Finish Invoice Form"
                                 >
                                    <Text style={styles.finishButtonText}>
                                        Finish Invoice Form
                                    </Text>
                                </TouchableOpacity>                        
                            </View>
                        </Card>
                    </View>
                </TouchableWithoutFeedback>
            </ScrollView>
        </KeyboardAvoidingView>

        {/**Signature Modal */}
        <Modal
                visible={showSignatureModal}
                animationType="slide"
                onRequestClose={() => setShowSignatureModal(false)}
                statusBarTranslucent
            >
            <View style={styles.signatureModal}>
                <View style={styles.signatureHeader}>
                    <Text style={[styles.fieldText, { color: '#000' }]}>
                        {signature ? 'Edit Signature' : 'Draw Signature'}
                    </Text>
                    <TouchableOpacity
                        onPress={() => setShowSignatureModal(false)}
                        accessibilityLabel="Close signature modal"
                    >
                        <Text style={[styles.modalButtonText, { color: '#000' }]}>Close</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.signatureCanvasContainer}>
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

export default AddInvoiceForm;

