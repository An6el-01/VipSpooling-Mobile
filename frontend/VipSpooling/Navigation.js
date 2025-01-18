import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Welcome from './screens/Onboarding/Welcome';
import SignIn from './screens/Onboarding/SignIn';
import SetUp from './screens/Onboarding/SetUp';
import Settings from './screens/Settings';
import MyTemplates from './screens/Invoices/MyTemplates';
import NewTeamMember from './screens/Team/Add/NewTeamMember';
import Home from './screens/Home';


const stack = createStackNavigator();

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
                    component={Home}
                    options={{ headerShown: false }}
                />
                <stack.Screen
                    name="NewTeamMember"
                    component={NewTeamMember}
                    options={{ headerShown: false }}
                />
                <stack.Screen
                    name="MyTemplates"
                    component={MyTemplates}
                    options={{ headerShown: false }}
                />
                <stack.Screen
                    name="Settings"
                    component={Settings}
                    options={{ headerShown: false }}
                />
            </stack.Navigator>
        </NavigationContainer>
    );
};

export default Navigation;