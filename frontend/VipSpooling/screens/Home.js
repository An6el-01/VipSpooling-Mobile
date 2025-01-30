import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../store/themeSlice';
import Card from '../components/Card';
import { useNavigation } from '@react-navigation/native';

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
    left: 30, //Centers The Icon for shortcuts.
  },
  sectionText: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
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
});

const Dashboard = () => {
  const navigation = useNavigation();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const dispatch = useDispatch();

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
            <TouchableOpacity onPress={() => {navigation.navigate('NewTeamMember')}}>
              <Image
                source={require('../assets/addUser.png')}
                style={[styles.sectionIcon, { tintColor: isDarkMode ? '#fff' : '#000' }]}
              />
              <Text style={[styles.sectionText, { color: isDarkMode ? '#fff' : '#000'}]}>Add New User</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {navigation.navigate('MyTemplates')}}>
              <Image
                source={require('../assets/templates.png')}
                style={[styles.sectionIcon, { tintColor: isDarkMode ? '#fff' : '#000'}]}
              />
              <Text style={[styles.sectionText, { color: isDarkMode ? '#fff' : '#000'}]}>My Templates</Text>
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
          {/* Activity Cards */}
          {/*
          ADD IN LINE STYLING
            - Make the Invoice stretch across the entire Card
        */}
          <Card isDarkMode={isDarkMode} style={{padding: 8}}>
            {[1, 2, 3, 4, 5].map((item, index) => (
                <View key={index} style={[styles.activityCard, { backgroundColor: isDarkMode ? '#000' : '#fff', borderBottomColor: isDarkMode ? '#fff' : '#000'}]}>
                <View style={styles.activityDetails}>
                    <Text style={[styles.activityText, {color: isDarkMode ? '#fff' : '#000'}]}>Invoice {item}</Text>
                    <Text style={[styles.activityText, {fontSize: 12 }]}>
                    {18 + index}/11/2024 - INV-0000{item}
                    </Text>
                </View>
                <TouchableOpacity>
                    <Image
                    source={require('../assets/view.png')}
                    style={[styles.activityIcon, { tintColor: isDarkMode ? '#fff' : '#000'}]}
                    />
                </TouchableOpacity>
                </View>
            ))}
          </Card>
          
        </View>
      </View>
    </ImageBackground>
  );
};

export default Dashboard;
