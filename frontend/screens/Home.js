import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground, ActivityIndicator, ScrollView } from 'react-native';
import { useAppSelector, useAppDispatch } from '../hooks/hooks';
import { toggleTheme } from '../store/themeSlice';
import { selectSortedForms } from '../store/formsSlice';
import Card from '../components/Card';
import { useNavigation } from '@react-navigation/native';
import CustomBottomTab from '../components/CustomBottomTab';

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
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
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#000',
    marginBottom: 10,
    top: 40,
  },
  sectionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 13,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  sectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
  },
  sectionIcon: {
    width: 28,
    height: 28,
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  newFormIcon: {
    alignItems: 'center',
  },
  addNewUser: {
    alignItems: 'center',
  },
  activitySection: {
    marginTop: 20,
  },
  activityTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
    marginBottom: 10,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    borderColor: '#ccc'
  },
  activityDetails: {
    flexDirection: 'column',
    marginRight: 25,
  },
  activityText: {
    fontSize: 15,
    width: '220',//THIS CONTROLS WIDTH OF INVOICES (NOT OPTIMIZED CORRECTLY FOR ALL SCREENS.)
    fontWeight: '700',
    color: '#838383',
    marginBottom:5,
  },
  activityIcon: {
    width: 30,
    height: 30,
    tintColor: '#000',
  },
  cardContainer: {
    height: 410,
},
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  cardContent: {
    flex: 1,
  },
});

const Dashboard = () => {
  const navigation = useNavigation();
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const dispatch = useAppDispatch();

  // Get all forms from Redux store
  const allForms = useAppSelector(selectSortedForms);
  const loading = useAppSelector((state) => state.forms.loading);
  const error = useAppSelector((state) => state.forms.error);

  // Get the 5 most recent forms
  const recentForms = allForms.slice(0, 5);

  const backgroundImage = isDarkMode
    ? require('../assets/DarkMode.jpg')
    : require('../assets/LightMode.jpg');

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#000' }]}>
            Dashboard
          </Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={() => dispatch(toggleTheme())}>
              <Image
                source={
                    isDarkMode
                        ? require('../assets/sun.png')
                        : require('../assets/moon.png')
                }
                style={[styles.headerIcon, { tintColor: isDarkMode ? '#fff' : '#000' }]}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {navigation.navigate('Settings')}}>
              <Image
                source={require('../assets/settings.png')}
                style={[styles.headerIcon, { tintColor: isDarkMode ? '#fff' : '#000' }]}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Add New User & My Templates Section */}
        <Card isDarkMode={isDarkMode} style={{padding: 15, width: '80%', alignSelf: 'center', marginTop: 15}}>
          <View style={styles.sectionButton}>
            <TouchableOpacity style={styles.addNewUser} onPress={() => {navigation.navigate('NewTeamMember')}}>
              <Image
                source={require('../assets/addUser.png')}
                style={[styles.sectionIcon, { tintColor: isDarkMode ? '#fff' : '#000' }]}
              />
              <Text style={[styles.sectionText, { color: isDarkMode ? '#fff' : '#000'}]}>Add New User</Text>
            </TouchableOpacity>
            <TouchableOpacity  style={styles.newFormIcon} onPress={() => {navigation.navigate('MyTemplates')}}>
              <Image
                source={require('../assets/templates.png')}
                style={[styles.sectionIcon, { tintColor: isDarkMode ? '#fff' : '#000'}]}
              />
              <Text style={[styles.sectionText, { color: isDarkMode ? '#fff' : '#000'}]}>New Form</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Recent Activity Section */}
        <View style={styles.activitySection}>
          <Text
            style={[styles.activityTitle, { color: isDarkMode ? '#fff' : '#000' }]}
          >
            Recent Activity
          </Text>
          <Card isDarkMode={isDarkMode} style={[{padding: 8}, styles.cardContainer]}>
            <ScrollView 
              style={styles.cardContent}
              showsVerticalScrollIndicator={true}
            >
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={isDarkMode ? '#fff' : '#000'} />
                  <Text style={[styles.loadingText, { color: isDarkMode ? '#fff' : '#000' }]}>
                    Loading recent forms...
                  </Text>
                </View>
              ) : error ? (
                <View style={styles.errorContainer}>
                  <Text style={[styles.errorText, { color: isDarkMode ? '#fff' : '#000' }]}>
                    {error}
                  </Text>
                </View>
              ) : recentForms.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={[styles.emptyText, { color: isDarkMode ? '#fff' : '#000' }]}>
                    No recent forms found
                  </Text>
                </View>
              ) : (
                recentForms.map((form, index) => (
                  <View key={index} style={[styles.activityCard, { backgroundColor: isDarkMode ? '#000' : '#fff', borderBottomColor: isDarkMode ? '#fff' : '#000'}]}>
                    <View style={styles.activityDetails}>
                      <Text style={[styles.activityText, {color: isDarkMode ? '#fff' : '#000'}]}>
                        {form._typename || (form.formType === 'invoice' ? 'Invoice Form' : 'JSA Form')}
                      </Text>
                      <Text style={[styles.activityText, {fontSize: 12 }]}>
                        {form.formType === 'invoice' 
                          ? `${form.InvoiceDate || 'No Date'} - ${form.WorkTicketID || 'No ID'}`
                          : `${form.FormDate || 'No Date'} - ${form.CustomerName || 'No Customer'}`
                        }
                      </Text>
                    </View>
                    <TouchableOpacity onPress={() => {
                      navigation.navigate('ViewForm', { 
                        formData: {
                          ...form,
                          _typename: form.formType === 'invoice' ? 'Invoice Form' : 'JSA Form'
                        }
                      });
                    }}>
                      <Image
                        source={require('../assets/view.png')}
                        style={[styles.activityIcon, { tintColor: isDarkMode ? '#fff' : '#000'}]}
                      />
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </ScrollView>
          </Card>
        </View>
      </View>
      <CustomBottomTab/>
    </ImageBackground>
  );
};

export default Dashboard;
