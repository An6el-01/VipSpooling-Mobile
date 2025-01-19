import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {Image, StyleSheet} from 'react-native';
import { useSelector } from 'react-redux';

//Screens
import Welcome from './screens/Onboarding/Welcome';
import SignIn from './screens/Onboarding/SignIn';
import SetUp from './screens/Onboarding/SetUp';
import Settings from './screens/Settings';
import MyTemplates from './screens/Invoices/MyTemplates';
import NewTeamMember from './screens/Team/Add/NewTeamMember';
import Home from './screens/Home';
import MyInvoices from './screens/Invoices/MyInvoices';
import MyTeam from './screens/Team/MyTeam';
import Plans from './screens/Plans';


const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        width: '90%',  // Maintain 90% width
        bottom: 20,  // Positioned above screen bottom for better UI
        height: 75,  // Proper touch area
        borderRadius: 20,  // Rounded corners for aesthetics
        alignSelf: 'center',  // Center the tab bar
        backgroundColor: '#fff',
        borderWidth: 2, // Uniform border width
        borderColor: '#000',  // High contrast for light mode
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 6 }, // More pronounced shadow
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 10,  // For Android shadow effect
    },
    darkModeTabBar: {
        backgroundColor: '#000',
        borderColor: '#fff',  // High contrast for dark mode
    },
    tabIcon: {
        width: 34,
        height: 34,
    },
    tabLabel: {
        fontSize: 14,  // Improved readability
        fontWeight: '600',
        letterSpacing: 0.8,  // Better letter spacing for legibility
    }
});


const stack = createStackNavigator();
const InnerStack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigation = () => {
    // Get dark mode state from Redux
    const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => {
            let iconSource;
  
            // Set the icon source based on route name
            if (route.name === 'Home') {
              iconSource = require('./assets/home.png');
            } else if (route.name === 'Invoices') {
              iconSource = require('./assets/invoice.png');
            } else if (route.name === 'My Team') {
              iconSource = require('./assets/team.png');
            }else if (route.name === 'Plans') {
                iconSource = require('./assets/plansIcon.png')
            }
  
            return (
              <Image
                source={iconSource}
                style={[
                  styles.tabIcon,
                  {
                    tintColor: focused
                      ? isDarkMode
                        ? '#838383' // Active in dark mode
                        : '#838383' // Active in light mode
                      : isDarkMode
                      ? '#fff' // Inactive in dark mode
                      : '#000', // Inactive in light mode
                  },
                ]}
              />
            );
          },
          tabBarActiveTintColor: isDarkMode ? '#F7AD00' : '#555',
          tabBarInactiveTintColor: isDarkMode ? '#fff' : '#000',
          tabBarStyle: [
            styles.tabBar,
            isDarkMode ? styles.darkModeTabBar : null,
            {
              tabBarLabelStyle: styles.tabLabel,
              tabBarShowLabel: true,
            },
          ],
        })}
      >
        <Tab.Screen
            name="Home"
            options={{ headerShown: false }}
        >
          {() => (
            <InnerStack.Navigator>
                <InnerStack.Screen name="Home" component={Home} options={{ headerShown: false }}/>
                <InnerStack.Screen name="Settings" component={Settings} options={{headerShown: false }}/>
                <InnerStack.Screen name="MyTemplates" component={MyTemplates} options={{headerShown: false}}/>
                <InnerStack.Screen name="NewTeamMember" component={NewTeamMember} options={{headerShown: false}} />
            </InnerStack.Navigator>
          )}
        </Tab.Screen>
        <Tab.Screen name="Invoices" component={MyInvoices} options={{headerShown: false}}/>
        <Tab.Screen name="My Team" component={MyTeam} options={{headerShown: false}}/>
        <Tab.Screen name="Plans" component={Plans} options={{headerShown: false}}/>
        </Tab.Navigator>
    );
  };

const Navigation = () => {
    return(
        <NavigationContainer>
            <stack.Navigator initialRouteName="Welcome">
                <stack.Screen
                    name="Welcome"
                    component={Welcome}
                    options={{ headerShown: false }}
                />
                <stack.Screen
                    name="SignIn"
                    component={SignIn}
                    options={{ headerShown: false }}
                />
                <stack.Screen
                    name="SetUp"
                    component={SetUp}
                    options={{ headerShown: false }}
                />
                <stack.Screen
                    name="Home"
                    component={TabNavigation}
                    options={{ headerShown: false }}
                />
            </stack.Navigator>
        </NavigationContainer>
    );
};

export default Navigation;

