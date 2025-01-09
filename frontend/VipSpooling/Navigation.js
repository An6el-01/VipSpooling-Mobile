import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Welcome from './screens/Onboarding/Welcome';
import SignIn from './screens/Onboarding/SignIn';

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
            </stack.Navigator>
        </NavigationContainer>
    );
};

export default Navigation;