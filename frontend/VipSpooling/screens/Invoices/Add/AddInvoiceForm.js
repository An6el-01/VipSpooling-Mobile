import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ImageBackground, Image, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../../store/themeSlice';
import Card from '../../../components/Card';
import DateTimePicker from '@react-native-community/datetimepicker';

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
});

const AddInvoiceForm = () => {
    const navigation = useNavigation();
    const isDarkMode = useSelector((state) => state.theme.isDarkMode);
    const dispatch = useDispatch();
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [formDate, setFormDate] = useState(new Date());
    const [formattedDate, setFormattedDate] = useState('');

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
                                <View></View>
                            </Card>
                        </View>
                    </TouchableWithoutFeedback>
                </ScrollView>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
}

export default AddInvoiceForm;

