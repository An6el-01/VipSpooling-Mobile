import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ImageBackground, Image, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../../store/themeSlice';
import Card from '../../../components/Card';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

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
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        backgroundColor: '#fff',
        marginBottom: 8,
        height: 50,
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
        marginBottom: 15,
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
        fontWeight: '500',
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
    laborInputLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
        textAlign: 'center',
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
    consumablesHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingBottom: 8,
    },
    consumableHeaderText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        textAlign: 'center',
    },
    consumableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        backgroundColor: '#f5f5f5',
        padding: 8,
        borderRadius: 6,
    },
    consumableItemContainer: {
        flex: 2,
        marginRight: 8,
    },
    otherInput: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        paddingHorizontal: 8,
        marginTop: 4,
        backgroundColor: '#fff',
    },
    consumableInput: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        paddingHorizontal: 8,
        backgroundColor: '#fff',
        textAlign: 'center',
        marginHorizontal: 4,
    },
    addRowButton: {
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
        backgroundColor: '#007AFF',
    },
    addRowButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
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
});

const AddInvoiceForm = () => {
    const navigation = useNavigation();
    const isDarkMode = useSelector((state) => state.theme.isDarkMode);
    const dispatch = useDispatch();
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [formDate, setFormDate] = useState(new Date());
    const [formattedDate, setFormattedDate] = useState('');
    const [laborCosts, setLaborCosts] = useState({
        loadUnload: { rate: '', qty: '', amount: '' },
        spoolerMiles: { rate: '', qty: '', amount: '' },
        travelTime: { rate: '', qty: '', amount: '' },
        standbyTime: { rate: '', qty: '', amount: '' },
        spoolerLabor: { rate: '', qty: '', amount: '' },
    });
    const [mainJobType, setMainJobType] = useState('install'); // 'install' or 'pull'
    const [additionalJobTypes, setAdditionalJobTypes] = useState({
        gasLift: false,
        gasInstall: false,
        ctSpooler: false,
        cableSpooler: false,
        comboSpooler: false,
        technicianLaydown: false,
    });

    // Add consumables state
    const [consumables, setConsumables] = useState([
        { item: '', qty: '', rate: '', amount: '', isOther: false, otherText: '' }
    ]);

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

    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setFormDate(selectedDate);

            const formatted = selectedDate.toISOString().split('T')[0].replace(/-/g, '/');
            setFormattedDate(formatted);
        }
    };

    const showDatepicker = () => {
        setShowDatePicker(true);
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

    const updateConsumable = (index, field, value) => {
        const newConsumables = [...consumables];
        newConsumables[index][field] = value;

        if (field === 'item') {
            newConsumables[index].isOther = value === 'Other';
            if (!newConsumables[index].isOther) {
                newConsumables[index].otherText = '';
            }
        }

        if (field === 'rate' || field === 'qty') {
            const rate = field === 'rate' ? parseFloat(value) : parseFloat(newConsumables[index].rate);
            const qty = field === 'qty' ? parseFloat(value) : parseFloat(newConsumables[index].qty);
            
            if (!isNaN(rate) && !isNaN(qty)) {
                newConsumables[index].amount = (rate * qty).toFixed(2);
            }
        }

        setConsumables(newConsumables);
    };

    const addConsumableRow = () => {
        setConsumables([...consumables, { item: '', qty: '', rate: '', amount: '', isOther: false, otherText: '' }]);
    };

    return(
        <ImageBackground source={backgroundImage} style={styles.background}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                    bounces={false}
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

                                {/* Order Date Input */}
                                <View style={[styles.fieldContainer, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)', borderRadius: 12 }]}>
                                    <Text style={[styles.dateFieldText, {color: isDarkMode ? '#fff' : '#000'}]}>
                                        Invoice Date:
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

                                {/** Spooler Input */}
                                <View style={styles.inputContainer}>
                                    <Text style={[styles.fieldText, {color: isDarkMode ? '#fff' : '#000'}]}>
                                        Spooler:
                                    </Text>
                                    <View style={styles.inputField}>
                                        <TextInput
                                            style={styles.inputText}
                                            placeholder="Enter Spooler Name"
                                            placeholderTextColor={isDarkMode ? '#fff' : '#000'}
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
                                            placeholderTextColor={isDarkMode ? '#fff' : '#000'}
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
                                            placeholderTextColor={isDarkMode ? '#fff' : '#000'}
                                        />
                                    </View>
                                </View>

                                {/**Oil Company Input*/}
                                <View style={styles.inputContainer}>
                                    <Text style={[styles.fieldText, { color: isDarkMode ? '#fff' : '#000'}]}>
                                        Enter Oil Company:
                                    </Text>
                                    <View style={styles.inputField}>
                                        <TextInput
                                            style={styles.inputText}
                                            placeholder='Enter Oil Company'
                                            placeholderTextColor={isDarkMode ? '#fff' : '#000'}
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
                                            placeholderTextColor={isDarkMode ? '#fff' : '#000'}
                                            keyboardType='numeric'
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
                                            placeholderTextColor={isDarkMode ? '#fff' : '#000'}
                                        />
                                    </View>
                                </View>

                                {/** Labor Costs Input*/}
                                <View style={styles.laborSection}>
                                    <Text style={[styles.laborSectionTitle, { color: isDarkMode ? '#fff' : '#000' }]}>
                                        Labor Costs
                                    </Text>

                                    {/* Headers */}
                                    <View style={styles.laborInputsContainer}>
                                        <View style={styles.laborInputWrapper}>
                                            <Text style={[styles.laborInputLabel, { color: isDarkMode ? '#fff' : '#666' }]}>
                                                Rate
                                            </Text>
                                        </View>
                                        <View style={styles.laborInputWrapper}>
                                            <Text style={[styles.laborInputLabel, { color: isDarkMode ? '#fff' : '#666' }]}>
                                                QTY
                                            </Text>
                                        </View>
                                        <View style={styles.laborInputWrapper}>
                                            <Text style={[styles.laborInputLabel, { color: isDarkMode ? '#fff' : '#666' }]}>
                                                Amount
                                            </Text>
                                        </View>
                                    </View>

                                    {/* Load/Unload */}
                                    <View style={styles.laborRow}>
                                        <View style={styles.laborRowHeader}>
                                            <Text style={[styles.laborLabel, { color: isDarkMode ? '#fff' : '#000' }]}>
                                                Load/Unload:
                                            </Text>
                                        </View>
                                        <View style={styles.laborInputsContainer}>
                                            <View style={styles.laborInputWrapper}>
                                                <TextInput
                                                    style={[styles.laborInput, { color: isDarkMode ? '#fff' : '#000' }]}
                                                    keyboardType="decimal-pad"
                                                    placeholder="0.00"
                                                    placeholderTextColor={isDarkMode ? '#666' : '#aaa'}
                                                    value={laborCosts.loadUnload.rate}
                                                    onChangeText={(value) => updateLaborCost('loadUnload', 'rate', value)}
                                                />
                                            </View>
                                            <View style={styles.laborInputWrapper}>
                                                <TextInput
                                                    style={[styles.laborInput, { color: isDarkMode ? '#fff' : '#000' }]}
                                                    keyboardType="decimal-pad"
                                                    placeholder="Hours:"
                                                    placeholderTextColor={isDarkMode ? '#666' : '#aaa'}
                                                    value={laborCosts.loadUnload.qty}
                                                    onChangeText={(value) => updateLaborCost('loadUnload', 'qty', value)}
                                                />
                                            </View>
                                            <View style={styles.laborInputWrapper}>
                                                <TextInput
                                                    style={[styles.laborInput, { color: isDarkMode ? '#fff' : '#000' }]}
                                                    editable={false}
                                                    value={laborCosts.loadUnload.amount}
                                                    placeholder="Total:"
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
                                                <TextInput
                                                    style={[styles.laborInput, { color: isDarkMode ? '#fff' : '#000' }]}
                                                    keyboardType="decimal-pad"
                                                    placeholder="0.00"
                                                    placeholderTextColor={isDarkMode ? '#666' : '#aaa'}
                                                    value={laborCosts.spoolerMiles.rate}
                                                    onChangeText={(value) => updateLaborCost('spoolerMiles', 'rate', value)}
                                                />
                                            </View>
                                            <View style={styles.laborInputWrapper}>
                                                <TextInput
                                                    style={[styles.laborInput, { color: isDarkMode ? '#fff' : '#000' }]}
                                                    keyboardType="decimal-pad"
                                                    placeholder="Miles:"
                                                    placeholderTextColor={isDarkMode ? '#666' : '#aaa'}
                                                    value={laborCosts.spoolerMiles.qty}
                                                    onChangeText={(value) => updateLaborCost('spoolerMiles', 'qty', value)}
                                                />
                                            </View>
                                            <View style={styles.laborInputWrapper}>
                                                <TextInput
                                                    style={[styles.laborInput, { color: isDarkMode ? '#fff' : '#000' }]}
                                                    editable={false}
                                                    value={laborCosts.spoolerMiles.amount}
                                                    placeholder="Total:"
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
                                                <TextInput
                                                    style={[styles.laborInput, { color: isDarkMode ? '#fff' : '#000' }]}
                                                    keyboardType="decimal-pad"
                                                    placeholder="0.00"
                                                    placeholderTextColor={isDarkMode ? '#666' : '#aaa'}
                                                    value={laborCosts.travelTime.rate}
                                                    onChangeText={(value) => updateLaborCost('travelTime', 'rate', value)}
                                                />
                                            </View>
                                            <View style={styles.laborInputWrapper}>
                                                <TextInput
                                                    style={[styles.laborInput, { color: isDarkMode ? '#fff' : '#000' }]}
                                                    keyboardType="decimal-pad"
                                                    placeholder="Hours:"
                                                    placeholderTextColor={isDarkMode ? '#666' : '#aaa'}
                                                    value={laborCosts.travelTime.qty}
                                                    onChangeText={(value) => updateLaborCost('travelTime', 'qty', value)}
                                                />
                                            </View>
                                            <View style={styles.laborInputWrapper}>
                                                <TextInput
                                                    style={[styles.laborInput, { color: isDarkMode ? '#fff' : '#000' }]}
                                                    editable={false}
                                                    value={laborCosts.travelTime.amount}
                                                    placeholder="Total:"
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
                                                <TextInput
                                                    style={[styles.laborInput, { color: isDarkMode ? '#fff' : '#000' }]}
                                                    keyboardType="decimal-pad"
                                                    placeholder="0.00"
                                                    placeholderTextColor={isDarkMode ? '#666' : '#aaa'}
                                                    value={laborCosts.standbyTime.rate}
                                                    onChangeText={(value) => updateLaborCost('standbyTime', 'rate', value)}
                                                />
                                            </View>
                                            <View style={styles.laborInputWrapper}>
                                                <TextInput
                                                    style={[styles.laborInput, { color: isDarkMode ? '#fff' : '#000' }]}
                                                    keyboardType="decimal-pad"
                                                    placeholder="Hours:"
                                                    placeholderTextColor={isDarkMode ? '#666' : '#aaa'}
                                                    value={laborCosts.standbyTime.qty}
                                                    onChangeText={(value) => updateLaborCost('standbyTime', 'qty', value)}
                                                />
                                            </View>
                                            <View style={styles.laborInputWrapper}>
                                                <TextInput
                                                    style={[styles.laborInput, { color: isDarkMode ? '#fff' : '#000' }]}
                                                    editable={false}
                                                    value={laborCosts.standbyTime.amount}
                                                    placeholder="Total:"
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
                                                <TextInput
                                                    style={[styles.laborInput, { color: isDarkMode ? '#fff' : '#000' }]}
                                                    keyboardType="decimal-pad"
                                                    placeholder="0.00"
                                                    placeholderTextColor={isDarkMode ? '#666' : '#aaa'}
                                                    value={laborCosts.spoolerLabor.rate}
                                                    onChangeText={(value) => updateLaborCost('spoolerLabor', 'rate', value)}
                                                />
                                            </View>
                                            <View style={styles.laborInputWrapper}>
                                                <TextInput
                                                    style={[styles.laborInput, { color: isDarkMode ? '#fff' : '#000' }]}
                                                    keyboardType="decimal-pad"
                                                    placeholder="Hours:"
                                                    placeholderTextColor={isDarkMode ? '#666' : '#aaa'}
                                                    value={laborCosts.spoolerLabor.qty}
                                                    onChangeText={(value) => updateLaborCost('spoolerLabor', 'qty', value)}
                                                />
                                            </View>
                                            <View style={styles.laborInputWrapper}>
                                                <TextInput
                                                    style={[styles.laborInput, { color: isDarkMode ? '#fff' : '#000' }]}
                                                    editable={false}
                                                    value={laborCosts.spoolerLabor.amount}
                                                    placeholder="Total:"
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

                                    {/* Headers */}
                                    <View style={styles.consumablesHeader}>
                                        <Text style={[styles.consumableHeaderText, { color: isDarkMode ? '#fff' : '#000', flex: 2 }]}>Item</Text>
                                        <Text style={[styles.consumableHeaderText, { color: isDarkMode ? '#fff' : '#000', flex: 1 }]}>Qty</Text>
                                        <Text style={[styles.consumableHeaderText, { color: isDarkMode ? '#fff' : '#000', flex: 1 }]}>Rate</Text>
                                        <Text style={[styles.consumableHeaderText, { color: isDarkMode ? '#fff' : '#000', flex: 1 }]}>Amount</Text>
                                    </View>

                                    {/* Consumable Rows */}
                                    {consumables.map((consumable, index) => (
                                        <View key={index} style={styles.consumableRow}>
                                            <View style={[styles.consumableItemContainer]}>
                                                <View style={styles.dropdownContainer}>
                                                    <Picker
                                                        selectedValue={consumable.item}
                                                        onValueChange={(value) => updateConsumable(index, 'item', value)}
                                                        style={styles.picker}
                                                        itemStyle={{ height: 50 }}
                                                    >
                                                        <Picker.Item label="Select Item" value="" />
                                                        {consumableItems.map((item) => (
                                                            <Picker.Item 
                                                                key={item} 
                                                                label={item} 
                                                                value={item}
                                                            />
                                                        ))}
                                                    </Picker>
                                                </View>
                                                {consumable.isOther && (
                                                    <TextInput
                                                        style={[styles.otherInput, { color: isDarkMode ? '#fff' : '#000' }]}
                                                        placeholder="Enter custom item"
                                                        placeholderTextColor={isDarkMode ? '#666' : '#aaa'}
                                                        value={consumable.otherText}
                                                        onChangeText={(value) => updateConsumable(index, 'otherText', value)}
                                                    />
                                                )}
                                            </View>
                                            <TextInput
                                                style={[styles.consumableInput, { flex: 1 }]}
                                                keyboardType="decimal-pad"
                                                placeholder="0"
                                                placeholderTextColor={isDarkMode ? '#666' : '#aaa'}
                                                value={consumable.qty}
                                                onChangeText={(value) => updateConsumable(index, 'qty', value)}
                                            />
                                            <TextInput
                                                style={[styles.consumableInput, { flex: 1 }]}
                                                keyboardType="decimal-pad"
                                                placeholder="0.00"
                                                placeholderTextColor={isDarkMode ? '#666' : '#aaa'}
                                                value={consumable.rate}
                                                onChangeText={(value) => updateConsumable(index, 'rate', value)}
                                            />
                                            <TextInput
                                                style={[styles.consumableInput, { flex: 1 }]}
                                                editable={false}
                                                value={consumable.amount}
                                                placeholder="0.00"
                                                placeholderTextColor={isDarkMode ? '#666' : '#aaa'}
                                            />
                                        </View>
                                    ))}

                                    {/* Add Row Button */}
                                    <TouchableOpacity
                                        style={[styles.addRowButton, { backgroundColor: isDarkMode ? '#444' : '#ddd' }]}
                                        onPress={addConsumableRow}
                                    >
                                        <Text style={[styles.addRowButtonText, { color: isDarkMode ? '#fff' : '#000' }]}>
                                            Add Row
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                {/** Notes Section */}
                                <View style={styles.inputContainer}>
                                    <Text style={[styles.fieldText, { color: isDarkMode ? '#fff' : '#000'}]}>
                                        Notes:
                                    </Text>
                                    <View style={styles.inputField}>
                                        <TextInput
                                            style={[styles.input, { color: isDarkMode ? '#fff' : '#000'}]}
                                            placeholder="Enter notes"
                                            placeholderTextColor={isDarkMode ? '#666' : '#aaa'}
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
                                            style={[styles.input, { color: isDarkMode ? '#fff' : '#000'}]}
                                            keyboardType='numeric'
                                            placeholder='Enter Cable Length'
                                            placeholderTextColor={isDarkMode ? '#666' : '#aaa'}
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
                                            style={[styles.input, { color: isDarkMode ? '#fff' : '#000'}]}
                                            placeholder='Enter Cable Type'
                                            placeholderTextColor={isDarkMode ? '#666' : '#aaa'}
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
                                            style={[styles.input, { color: isDarkMode ? '#fff' : '#000'}]}
                                            placeholder='Enter Reel Number'
                                            placeholderTextColor={isDarkMode ? '#666' : '#aaa'}
                                            keyboardType='numeric'
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
                                            style={[styles.input, { color: isDarkMode ? '#fff' : '#000'}]}
                                            placeholder='Enter Extra Charges'
                                            placeholderTextColor={isDarkMode ? '#666' : '#aaa'}
                                            keyboardType='numeric'
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
                                            style={[styles.input, { color: isDarkMode ? '#fff' : '#000'}]}
                                            editable={false}  
                                        />
                                    </View>
                                </View>

                                <TouchableOpacity
                                style={[styles.finishButton, { borderColor: isDarkMode ? '#fff' : '#000' }]}
                                onPress={() => {
                                    // Add your finish form logic here
                                    console.log('Finishing Invoice Form...');
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
        </ImageBackground>
    );
}

export default AddInvoiceForm;

