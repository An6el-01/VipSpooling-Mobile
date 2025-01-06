import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import Card from '../../components/Card';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    cardContentContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoImage: {
        position: 'relative',
        bottom: 120,
        width: 120,
        height: 100,
        marginBottom: 20,
    },
    title: {
        position:'relative',
        bottom: 20,
        fontSize: 25,
        fontWeight: '700',
        marginBottom: 20,
        color: '#000',
    },
    codeInputContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    codeInput: {
        width: 50,
        height: 50,
        marginHorizontal: 5,
        textAlign: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#EA7E7E7',
        fontSize: 18,
        color: '#000',
    },
    submitButton: {
        backgroundColor: '#F7AD00',
        borderRadius: 5,
        borderWidth: 1.3,
        borderColor: '#000',
        paddingVertical: 10,
        paddingHorizontal: 50,
        borderRadius: 5,
        marginBottom: 20,
    },
    submitButtonText: {
        color: '#000',
        fontWeight: '600',
        fontSize: 16,
    },
    existingAccountText: {
        fontSize: 14,
        color: '#000',
        marginBottom: 5,
        textAlign: 'center',
    },
    clickHereButton: {
        backgroundColor: '#F7AD00',
        borderRadius: 5,
        borderWidth: 1.3,
        borderColor: '#000',
        paddingVertical: 10,
        paddingHorizontal: 50,
        borderRadius: 5,
        margin: 20,
    },
    clickHereButtonText: {
        color: '#000',
        fontWeight: '600',
        fontSize: 16,
    }
});

const Welcome = ({ isDarkMode }) => {
    return (
      <View style={styles.container}>
        {/* LOGO */}
        <Image
          source={require('../../assets/VipSpoolingLogo.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
  
        {/* TITLE */}
        <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#000' }]}>
          Insert Your Invite Code
        </Text>
  
        {/* Card Component */}
        <Card isDarkMode={isDarkMode}>
          {/* INVITE CODE INPUT AREA */}
          <View style={styles.codeInputContainer}>
            <TextInput
              style={[styles.codeInput, { color: isDarkMode ? '#fff' : '#000' }]}
              maxLength={1}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.codeInput, { color: isDarkMode ? '#fff' : '#000' }]}
              maxLength={1}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.codeInput, { color: isDarkMode ? '#fff' : '#000' }]}
              maxLength={1}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.codeInput, { color: isDarkMode ? '#fff' : '#000' }]}
              maxLength={1}
              keyboardType="numeric"
            />
          </View>
  
          {/* SUBMIT BUTTON */}
          <TouchableOpacity style={styles.submitButton}>
            <Text style={[styles.submitButtonText, { color: isDarkMode ? '#000' : '#000' }]}>
              Submit
            </Text>
          </TouchableOpacity>
  
          {/* EXISTING ACCOUNT BUTTON */}
          <TouchableOpacity>
            <Text style={[styles.existingAccountText, { color: isDarkMode ? '#fff' : '#000' }]}>
              Already Have An Account?
            </Text>
            <TouchableOpacity style={styles.clickHereButton}>
              <Text style={[styles.clickHereButtonText, { color: isDarkMode ? '#000' : '#000' }]}>
                Click Here
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </Card>
      </View>
    );
  };

export default Welcome;