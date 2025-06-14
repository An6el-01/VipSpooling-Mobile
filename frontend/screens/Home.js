import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground, ActivityIndicator, ScrollView } from 'react-native';
import { useAppSelector, useAppDispatch } from '../hooks/hooks';
import { toggleTheme } from '../store/themeSlice';
import { selectSortedForms, setUserInfo, clearForms, setLoading, setError, setForms } from '../store/formsSlice';
import Card from '../components/Card';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import CustomBottomTab from '../components/CustomBottomTab';
import { endpoints } from '../config/config';

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
    fontSize: 12,
    width: '220',//THIS CONTROLS WIDTH OF INVOICES (NOT OPTIMIZED CORRECTLY FOR ALL SCREENS.)
    fontWeight: '700',
    color: '#838383',
    marginBottom:10,
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
  noFormsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noFormsText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  noFormsSubText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
  },
});

const Dashboard = () => {
  const navigation = useNavigation();
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const dispatch = useAppDispatch();

  // Get user info from auth state using the correct selectors
  const authState = useAppSelector((state) => state.auth);
  const userAttributes = useAppSelector((state) => state.auth.userAttributes) || {};
  const userGroups = useAppSelector((state) => state.auth.userGroups) || [];
  const userName = userAttributes.name;
  const isOperator = userGroups.includes('Operator');

  // // Debug logging for user info
  console.log('Current User Info:', {
    userName,
    userGroups,
    isOperator,
    userAttributes
  });

  // Check authentication on mount and when auth state changes
  useEffect(() => {
    if (!authState.isAuthenticated || !authState.accessToken) {
      navigation.replace('SignIn');
      return;
    }

    // Ensure we have valid user data
    if (!userAttributes?.name || !userGroups) {
      // If we don't have valid user data, navigate to Settings to force a refresh
      navigation.navigate('Settings');
      return;
    }
  }, [authState.isAuthenticated, authState.accessToken, userAttributes, userGroups]);

  // Reset and fetch forms data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      const fetchForms = async () => {
        try {
          if (!authState.accessToken) {
            console.log('No auth token available, skipping forms fetch');
            return;
          }

          dispatch(clearForms());
          dispatch(setLoading(true));
          
          console.log('Fetching forms with params:', {
            userName,
            userRole: isOperator ? 'Operator' : 'Admin'
          });

          // Fetch all types of forms
          const responses = await Promise.all([
            fetch(`${endpoints.getAllInvoiceForms}?userName=${encodeURIComponent(userName)}&userRole=${isOperator ? 'Operator' : 'Admin'}`),
            fetch(`${endpoints.getAllJSAForms}?userName=${encodeURIComponent(userName)}&userRole=${isOperator ? 'Operator' : 'Admin'}`),
            fetch(`${endpoints.getAllCapillaryForms}?userName=${encodeURIComponent(userName)}&userRole=${isOperator ? 'Operator' : 'Admin'}`)
          ]);

          const [invoiceForms, jsaForms, capillaryForms] = await Promise.all(
            responses.map(response => response.json())
          );

          // Combine all forms with proper type information
          const allForms = [
            ...(invoiceForms.data || []).map(form => ({
              ...form,
              formType: 'invoice',
              _typename: 'Invoice Form'
            })),
            ...(jsaForms.data || []).map(form => ({
              ...form,
              formType: 'jsa',
              _typename: 'JSA Form'
            })),
            ...(capillaryForms.data || []).map(form => ({
              ...form,
              formType: 'capillary',
              _typename: 'Capillary Form'
            }))
          ];

          dispatch(setForms(allForms));
        } catch (error) {
          console.error('Error fetching forms:', error);
          dispatch(setError('Failed to fetch forms'));
        } finally {
          dispatch(setLoading(false));
        }
      };

      fetchForms();
    }, [dispatch, userName, isOperator, authState.accessToken])
  );

  // Set user info in forms slice
  useEffect(() => {
    if (userName && userGroups.length > 0) {
      console.log('Setting user info in forms slice:', {
        name: userName,
        role: isOperator ? 'Operator' : 'Admin'
      });
      
      dispatch(setUserInfo({
        name: userName,
        role: isOperator ? 'Operator' : 'Admin'
      }));
    }
  }, [userName, userGroups, dispatch, isOperator]);

  // Get filtered forms from Redux store
  const allForms = useAppSelector(selectSortedForms);
  const loading = useAppSelector((state) => state.forms.loading);
  const error = useAppSelector((state) => state.forms.error);

  // Debug logging for filtered forms
  // console.log('Filtered Forms:', allForms);

  // Get the 5 most recent forms
  const recentForms = allForms.slice(0, 5);

  // Debug logging for recent forms
  // console.log('Recent Forms:', recentForms);

  const backgroundImage = isDarkMode
    ? require('../assets/DarkMode.jpg')
    : require('../assets/LightMode.jpg');

  const renderNoFormsMessage = () => (
    <View style={styles.noFormsContainer}>
      <Text style={[styles.noFormsText, { color: isDarkMode ? '#fff' : '#000' }]}>
        {isOperator 
          ? "You haven't created any forms yet"
          : "No forms available"}
      </Text>
      <Text style={[styles.noFormsSubText, { color: isDarkMode ? '#ccc' : '#666' }]}>
        {isOperator 
          ? "Create a new form to get started"
          : "Forms will appear here once they are created"}
      </Text>
    </View>
  );

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
            {!isOperator && (
              <TouchableOpacity style={styles.addNewUser} onPress={() => {navigation.navigate('NewTeamMember')}}>
                <Image
                  source={require('../assets/addUser.png')}
                  style={[styles.sectionIcon, { tintColor: isDarkMode ? '#fff' : '#000' }]}
                />
                <Text style={[styles.sectionText, { color: isDarkMode ? '#fff' : '#000'}]}>Add New User</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={[
                styles.newFormIcon,
                // If operator, take full width, otherwise keep original style
                !isOperator ? null : { width: '100%' }
              ]} 
              onPress={() => {navigation.navigate('MyTemplates')}}
            >
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
          <Text style={[styles.activityTitle, { color: isDarkMode ? '#fff' : '#000' }]}>
            Recent Activity
          </Text>
          <Card isDarkMode={isDarkMode} style={[{padding: 8}, styles.cardContainer]}>
            <ScrollView style={styles.cardContent} showsVerticalScrollIndicator={true}>
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
                renderNoFormsMessage()
              ) : (
                recentForms.map((form, index) => (
                  <View key={index} style={[styles.activityCard, { backgroundColor: isDarkMode ? '#000' : '#fff', borderBottomColor: isDarkMode ? '#fff' : '#000'}]}>
                    <View style={styles.activityDetails}>
                      <Text style={[styles.activityText, {color: isDarkMode ? '#fff' : '#000'}]}>
                        {(() => {
                            if (form.formType === 'invoice') {
                                return `${form.CableCompany || ''}, ${form.OilCompany || ''}, ${form.WorkTicketID || ''}`.trim() || form._typename;
                            } else if (form.formType === 'jsa') {
                                return `${form.CustomerName || ''}, ${form.Location || ''}, ${form.WorkTicketID || ''}`.trim() || form._typename;
                            } else if (form.formType === 'capillary') {
                                return `${form.Customer || ''}, ${form.WellName || ''}, ${form.WorkTicketID || ''}`.trim() || form._typename;
                            }
                            return form._typename;
                        })()}
                      </Text>
                      <Text style={[styles.activityText, {fontSize: 12 }]}>
                      {(() => {
                          if (form.formType === 'invoice') {
                              return `${form.Spooler || ''}, ${form.InvoiceDate || ''}`.trim() || 'No details available';
                          } else if (form.formType === 'jsa') {
                              return `${form.CreatedBy || ''}, ${form.EffectiveDate || ''}`.trim() || 'No details available';
                          } else if (form.formType === 'capillary') {
                              return `${form.TechnicianName || ''}, ${form.Date || ''}`.trim() || 'No details available';
                          }
                          return 'No details available';
                      })()}
                      </Text>
                    </View>
                    <TouchableOpacity onPress={() => {
                      navigation.navigate('ViewForm', { 
                        formData: {
                          ...form,
                          _typename: form._typename || (form.formType === 'invoice' ? 'Invoice Form' : 
                            form.formType === 'capillary' ? 'Capillary Form' : 'JSA Form')
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
