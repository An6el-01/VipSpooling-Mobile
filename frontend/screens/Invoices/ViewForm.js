import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, Image, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAppSelector, useAppDispatch } from '../../hooks/hooks';
import { toggleTheme } from '../../store/themeSlice';
import Card from '../../components/Card';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { endpoints } from '../../config/config';
import { WebView } from 'react-native-webview';

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
    },
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 30,
        fontWeight: '700',
        marginBottom: 20,
        top: 75,
    },
    header:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerIcons: {
        flexDirection: 'row',
        alignItems: 'center',
        top: 40,
        marginBottom: 90,
    },
    headerIcon: {
        width: 24,
        height: 24,
        marginLeft: 15,
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
    formImage: {
        width: 340,
        height: 480,
        resizeMode: 'contain',
    },
    pdfContainer: {
        width: 340,
        height: 480,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
    },
    webViewContainer: {
        width: 340,
        height: 480,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        overflow: 'hidden',
    },
    webView: {
        flex: 1,
    },
    pdfText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
    viewPdfButton: {
        backgroundColor: '#007AFF',
        borderRadius: 12,
        borderWidth: 1.3,
        borderColor: '#000',
        paddingVertical: 12,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginHorizontal: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    editButton:{
        backgroundColor: '#FFD700',
        borderRadius: 12,  
        borderWidth: 1.3,
        borderColor: '#000',
        paddingVertical: 12,  
        paddingHorizontal: 20,
        alignItems: 'center',  
        justifyContent: 'center',
        flex: 1,
        marginHorizontal: 3,
        shadowColor: '#000',  
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3, 
    },
    downloadButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 12,
        borderWidth: 1.3,
        borderColor: '#000',
        paddingVertical: 12,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginHorizontal: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        paddingHorizontal: 10,
    },
    buttonText: {
        color: '#000',
        fontWeight: '600',
        fontSize: 14,
        textAlign: 'center',
    },
    buttonIcon: {
        width: 20,
        height: 20,
        marginRight: 8,
        tintColor: '#000',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 480,
    },
});

const ViewForm = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
    const dispatch = useAppDispatch();
    const [pdfUrl, setPdfUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Get the form data from navigation params
    const { formData } = route.params || {};

    const generatePDF = async () => {
        if (!formData) return;

        setIsLoading(true);
        try {
            console.log('Sending request to generate PDF...');
            
            let endpoint;
            if (formData._typename === 'Invoice Form') {
                endpoint = endpoints.generateInvoicePDF;
            } else if (formData._typename === 'JSA Form') {
                endpoint = endpoints.generateJsaPDF;
            } else {
                console.log('No PDF generation available for this form type:', formData._typename);
                setIsLoading(false);
                return;
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            let data;
            const responseText = await response.text();
            console.log('Raw response from server:', responseText);
            
            try {
                data = JSON.parse(responseText);
                console.log('Parsed response from server:', data);
            } catch (parseError) {
                console.error('Failed to parse JSON response:', parseError);
                throw new Error(`Server returned invalid JSON: ${responseText.substring(0, 200)}`);
            }

            if (!response.ok) {
                throw new Error(data.error || 'Failed to generate PDF');
            }

            console.log('PDF URL received:', data.pdfUrl);
            setPdfUrl(data.pdfUrl);
        } catch (error) {
            console.error('Error generating PDF:', error);
            Alert.alert('Error', 'Failed to generate PDF');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (formData?._typename === 'Invoice Form' || formData?._typename === 'JSA Form') {
            generatePDF();
        }
    }, [formData]);


    const handleDownload = async () => {
        if (!pdfUrl) {
            Alert.alert('Error', 'PDF not yet generated');
            return;
        }

        try {
            const formType = formData._typename === 'Invoice Form' ? 'Invoice' : 'JSA';
            // Show download options to user
            Alert.alert(
                `Download ${formType} PDF`,
                'Choose how to save the PDF:',
                [
                    {
                        text: 'Share/Save PDF',
                        onPress: () => sharePDF()
                    },
                    {
                        text: 'Save to App Documents',
                        onPress: () => downloadToLocation('documents')
                    },
                    {
                        text: 'Cancel',
                        style: 'cancel'
                    }
                ]
            );
        } catch (error) {
            console.error('Error in download options:', error);
            Alert.alert('Error', 'Failed to show download options');
        }
    };

    const sharePDF = async () => {
        try {
            const formType = formData._typename === 'Invoice Form' ? 'invoice' : 'jsa';
            const fileName = `${formType}-${formData.WorkTicketID || 'Unknown'}-${Date.now()}.pdf`;
            const destinationUri = FileSystem.documentDirectory + fileName;

            console.log('Downloading PDF for sharing from:', pdfUrl);
            console.log('Saving to:', destinationUri);

            const downloadResult = await FileSystem.downloadAsync(
                pdfUrl,
                destinationUri
            );

            console.log('Download result for sharing:', downloadResult);

            if (downloadResult.status === 200) {
                // Check if sharing is available
                const isAvailable = await Sharing.isAvailableAsync();
                
                if (isAvailable) {
                    await Sharing.shareAsync(destinationUri, {
                        mimeType: 'application/pdf',
                        dialogTitle: `Save ${fileName}`,
                        UTI: 'com.adobe.pdf'
                    });
                } else {
                    Alert.alert('Sharing Not Available', 'Sharing is not available on this device.');
                }
            } else {
                throw new Error('Download failed');
            }
        } catch (error) {
            console.error('Error sharing PDF:', error);
            Alert.alert('Error', 'Failed to share PDF. Please try again.');
        }
    };

    const downloadToLocation = async (location) => {
        try {
            const formType = formData._typename === 'Invoice Form' ? 'invoice' : 'jsa';
            const fileName = `${formType}-${formData.WorkTicketID || 'Unknown'}-${Date.now()}.pdf`;
            const destinationUri = FileSystem.documentDirectory + fileName;

            // Check if file already exists and ask user if they want to overwrite
            const fileInfo = await FileSystem.getInfoAsync(destinationUri);
            if (fileInfo.exists) {
                Alert.alert(
                    'File Exists',
                    'A file with this name already exists. Do you want to overwrite it?',
                    [
                        {
                            text: 'Cancel',
                            style: 'cancel'
                        },
                        {
                            text: 'Overwrite',
                            onPress: () => performDownload(destinationUri)
                        }
                    ]
                );
                return;
            }

            await performDownload(destinationUri);
        } catch (error) {
            console.error('Error in downloadToLocation:', error);
            Alert.alert('Error', 'Failed to prepare download. Please try again.');
        }
    };

    const performDownload = async (destinationUri) => {
        try {
            console.log('Downloading PDF from:', pdfUrl);
            console.log('Saving to:', destinationUri);

            const downloadResult = await FileSystem.downloadAsync(
                pdfUrl,
                destinationUri
            );

            console.log('Download result:', downloadResult);

            if (downloadResult.status === 200) {
                // Get file info after download
                const fileInfo = await FileSystem.getInfoAsync(destinationUri);
                const fileSize = fileInfo.size ? `${(fileInfo.size / 1024).toFixed(1)} KB` : 'Unknown size';

                Alert.alert(
                    'Download Successful',
                    `PDF saved successfully!\n\nLocation: ${destinationUri}\nSize: ${fileSize}\n\nNote: In Expo Go, this file is saved within the app's sandbox and may not be accessible from the device's main file manager. Use the "Share/Save PDF" option for better file access.`,
                    [
                        {
                            text: 'OK'
                        }
                    ]
                );
            } else {
                throw new Error('Download failed');
            }
        } catch (error) {
            console.error('Error downloading PDF:', error);
            Alert.alert('Error', 'Failed to download PDF. Please try again.');
        }
    };

    const backgroundImage = isDarkMode
        ? require('../../assets/DarkMode.jpg')
        : require('../../assets/LightMode.jpg');

    const renderContent = () => {
        if (isLoading) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text>Generating PDF...</Text>
                </View>
            );
        }

        if (pdfUrl) {
            return (
                <View style={styles.webViewContainer}>
                    <WebView
                        source={{ uri: pdfUrl }}
                        style={styles.webView}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        startInLoadingState={true}
                        renderLoading={() => (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color="#0000ff" />
                                <Text>Loading PDF...</Text>
                            </View>
                        )}
                        onError={(syntheticEvent) => {
                            const { nativeEvent } = syntheticEvent;
                            console.error('WebView error:', nativeEvent);
                            Alert.alert('Error', 'Failed to load PDF. Please try again.');
                        }}
                    />
                </View>
            );
        }

        return (
            <Image
                source={
                    formData?._typename === 'JSA Form' 
                        ? require('../../assets/JSAForm.jpg')
                        : require('../../assets/InvoiceForm.jpg')
                }
                style={styles.formImage}
            />
        );
    };

    return(
        <ImageBackground source={backgroundImage} style={styles.background}>
            <View style={styles.container}>
                {/**HEADER SECTION*/}
                <View style={styles.header}>
                    <Text style={[styles.title, {color: isDarkMode ? '#fff' : '#000'}]}>
                        {formData?._typename || 'Form View'}
                    </Text>
                    <TouchableOpacity
                        style={styles.goBackButton}
                        onPress={() => {navigation.goBack()}}
                    >
                        <Image 
                            source={require('../../assets/arrowBack.png')} 
                            style={[styles.goBackIcon, {tintColor: isDarkMode ? '#fff' : '#000'}]} 
                        />
                        <Text style={[styles.goBackText, { color: isDarkMode ? '#fff' : '#000'}]}>Go Back</Text>
                    </TouchableOpacity>
                    <View style={styles.headerIcons}>
                        <TouchableOpacity onPress={() => dispatch(toggleTheme())}>
                            <Image
                                source={
                                    isDarkMode  
                                        ? require('../../assets/sun.png')
                                        : require('../../assets/moon.png')
                                }
                                style={[styles.headerIcon, { tintColor: isDarkMode ? '#fff' : '#000' }]}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {navigation.navigate('Settings')}}>
                            <Image
                                source={require('../../assets/settings.png')}
                                style={[styles.headerIcon, { tintColor: isDarkMode ? '#fff' : '#000'}]}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                {/**FORM VIEW SECTION*/}
                <Card style={[{marginTop: '40', backgroundColor:'#EAE7E7' }]}>
                    <View>
                        {renderContent()}
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity 
                                style={styles.editButton}
                                onPress={() => {
                                    // Navigate to the appropriate form based on _typename
                                    if (formData?._typename === 'Invoice Form') {
                                        navigation.navigate('AddInvoiceForm', { 
                                            formData: formData,
                                            isEditing: true 
                                        });
                                    } else if (formData?._typename === 'JSA Form') {
                                        navigation.navigate('AddJsaForm', { 
                                            formData: formData,
                                            isEditing: true 
                                        });
                                    } else {
                                        // Default to Capillary Form for any other type
                                        navigation.navigate('AddCapillaryForm', { 
                                            formData: formData,
                                            isEditing: true 
                                        });
                                    }
                                }}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image 
                                        source={require('../../assets/edit.png')} 
                                        style={styles.buttonIcon}
                                    />
                                    <Text style={styles.buttonText}>Edit</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[
                                    styles.downloadButton,
                                    !pdfUrl && { opacity: 0.5 }
                                ]}
                                onPress={handleDownload}
                                disabled={!pdfUrl}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image 
                                        source={require('../../assets/download.png')} 
                                        style={styles.buttonIcon}
                                    />
                                    <Text style={styles.buttonText}>Download</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Card>
            </View>
        </ImageBackground>
    );
};

export default ViewForm;