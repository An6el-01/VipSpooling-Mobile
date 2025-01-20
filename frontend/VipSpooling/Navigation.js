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
        width: '90%',  
        bottom: 20,  
        height: 75,  
        marginLeft: 20,  // not centered properly
        backgroundColor: '#fff',
        borderRadius: 20, 
        borderWidth: 1.3,
        borderTopWidth: 2,
        borderColor: '#000'
    },
    darkModeTabBar: {
        backgroundColor: '#000',

        borderColor: '#fff',
    },
    tabIcon: {
        top: 18,
        width: 30,
        height: 30,
        marginBottom:20,
    },
    tabLabel: {
        fontSize: 11,
        top:15,
        left: 1, //not centered properly
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
          tabBarActiveTintColor: isDarkMode ? '#F7AD00' : '#F7AD00',
          tabBarInactiveTintColor: isDarkMode ? '#fff' : '#000',
          tabBarStyle: [
            styles.tabBar,
            isDarkMode ? styles.darkModeTabBar : null,
          ],
          tabBarLabelStyle: styles.tabLabel,
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
        <Tab.Screen name="Invoices" component={MyInvoices} options={{headerShown: false}} />
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

