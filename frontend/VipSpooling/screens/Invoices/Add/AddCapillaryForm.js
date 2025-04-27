import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ImageBackground, Image, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../../store/themeSlice';
import Card from '../../../components/Card';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { Auth } from 'aws-amplify';
import { endpoints } from '../../../config';

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
    inputText: {
        color: '#000',
        fontSize: 16,
        flex: 1,
        textAlignVertical: 'top',
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
        marginBottom: 16,
    },
});

const AddCapillaryForm = () => {
    const navigation = useNavigation();
    const isDarkMode = useSelector((state) => state.theme.isDarkMode);
    const dispatch = useDispatch();
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [formDate, setFormDate] = useState(new Date());
    const [formattedDate, setFormattedDate] = useState('');
    const [technicianName, setTechnicianName] = useState('');

    const backgroundImage = isDarkMode
        ? require('../../../assets/DarkMode.jpg')
        : require('../../../assets/LightMode.jpg');

    useEffect(() => {
        fetchCurrentUser();
    }, []);

    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setFormDate(selectedDate);
            const formatted = selectedDate.toISOString().split('T')[0].replace(/-/g, '/');
            setFormattedDate(formatted);
        }
    };

    const fetchCurrentUser = async () => {
        try {
            const user = await Auth.currentAuthenticatedUser();
            const { attributes } = user;
            setTechnicianName(attributes.name || '');
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
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
                                <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#000' }]}>
                                    Add New Capillary Tubing Report Form
                                </Text>
                                <TouchableOpacity
                                    style={styles.goBackButton}
                                    onPress={() => navigation.goBack()}
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
                                            source={isDarkMode ? require('../../../assets/sun.png') : require('../../../assets/moon.png')}
                                            style={[styles.headerIcon, { tintColor: isDarkMode ? '#fff' : '#000' }]}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/**FORM SECTION */}
                            <Card isDarkMode={isDarkMode}>
                                <View style={styles.cardContainerContent}>
                                    {/* Date Input */}
                                    <View style={styles.dateContainer}>
                                        <Text style={[styles.dateFieldText, { color: isDarkMode ? '#fff' : '#000' }]}>
                                            Date:
                                        </Text>
                                        <View style={styles.datePickerContainer}>
                                            <DateTimePicker
                                                testID="dateTimePicker"
                                                value={formDate}
                                                mode="date"
                                                display={Platform.OS === 'ios' ? 'compact' : 'default'}
                                                onChange={onDateChange}
                                                style={{ width: '100%' }}
                                                textColor={isDarkMode ? '#fff' : '#000'}
                                                themeVariant={isDarkMode ? 'dark' : 'light'}
                                                accessibilityLabel="Date picker"
                                            />
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
                                        <Text style={[styles.fieldText,  {color: isDarkMode ? '#fff' : '#000'}]}>
                                            Type of Job:
                                        </Text>
                                        <View style={styles.inputField}>
                                            <TextInput
                                                style={styles.inputText}
                                                placeholder="Enter Type of Job"
                                                placeholderTextColor={'#000'}
                                            />
                                        </View>
                                    </View>

                                    {/**VISUAL/CONFIRMATION FLUID AT BHA */}
                                    <View style={styles.inputContainer}>
                                        <Text style={[styles.fieldText,  {color: isDarkMode ? '#fff' : '#000'}]}>
                                            Visual/Confirmation Fluid at BHA (Did we pump and see fluid at intake?):
                                        </Text>
                                        <View style={styles.inputField}>
                                            <TextInput
                                                style={styles.inputText}
                                                placeholder="Enter Visual/Confirmation Fluid at BHA"
                                                placeholderTextColor={'#000'}
                                            />
                                        </View>
                                    </View>

                                    {/**INTERVAL PUMPING THROUGHOUT JOB */}
                                    <View style={styles.inputContainer}>
                                        <Text style={[styles.fieldText, {color: isDarkMode ? '#fff' : '#000'}]}>
                                            Interval Pumping Throughout Job:
                                        </Text>
                                        <View style={styles.inputField}>
                                            <TextInput
                                                style={styles.inputText}
                                                placeholder="Enter Interval Pumping Throughout Job"
                                                placeholderTextColor={'#000'}
                                            />
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
                                        <View style={styles.inputField}>
                                            <TextInput
                                                style={styles.inputText}
                                                placeholder="Enter Did Pressure Bleed Down When Pump Turned Off At The End Of The Job?"
                                                placeholderTextColor={'#000'}
                                            />
                                        </View>
                                    </View>

                                    {/**WAS CAPILLARY FLUSHED AFTER WELL HEAD INSTALLED INPUT */}
                                    <View style={styles.inputContainer}>
                                        <Text style={[styles.fieldText, {color: isDarkMode ? '#fff' : '#000'}]}>
                                            Was Capillary Flushed After Well Head Installed?
                                        </Text>
                                        <View style={styles.inputField}>
                                            <TextInput
                                                style={styles.inputText}
                                                placeholder="Enter Was Capillary Flushed After Well Head Installed?"
                                                placeholderTextColor={'#000'}
                                            />
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

                                    {/**CAPILLARY SIZE */}
                                    <View style={styles.inputContainer}>
                                        <Text style={[styles.fieldText, {color: isDarkMode ? '#fff' : '#000'}]}>
                                            Capillary Size:
                                        </Text>
                                        <View style={styles.inputField}>
                                            <TextInput
                                                style={styles.inputText}
                                                placeholder="Enter Capillary Size"
                                                placeholderTextColor={'#000'}
                                            />
                                        </View>
                                    </View>

                                    {/**METALLURGY*/}
                                    <View style={styles.inputContainer}>
                                        <Text style={[styles.fieldText, {color: isDarkMode ? '#fff' : '#000'}]}>
                                            Metallurgy:
                                        </Text>
                                        <View style={styles.inputField}>
                                            <TextInput
                                                style={styles.inputText}
                                                placeholder="Enter Metallurgy"
                                                placeholderTextColor={'#000'}
                                            />
                                        </View>
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

                                    {/**NOTES/COMMENTS*/}
                                    <View style={styles.inputContainer}>
                                        <Text style={[styles.fieldText, {color: isDarkMode ? '#fff' : '#000'}]}>
                                            Notes/Comments:
                                        </Text>
                                        <View style={styles.inputField}>
                                            <TextInput
                                                style={styles.inputText}
                                                placeholder="Enter Notes/Comments"
                                                placeholderTextColor={'#000'}
                                            />
                                        </View>
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
                                            Finish Capillary Form
                                        </Text>
                                    </TouchableOpacity>

                                    </View>
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
