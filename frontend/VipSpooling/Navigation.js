import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

//Screens
import Welcome from './screens/Onboarding/Welcome';
import SignIn from './screens/Onboarding/SignIn';
import SetUp from './screens/Onboarding/SetUp';
import Settings from './screens/Settings';
import MyTemplates from './screens/Invoices/MyTemplates';
import NewTeamMember from './screens/Team/Add/NewTeamMember';
import Home from './screens/Home';
import MyForms from './screens/Invoices/MyForms';
import MyTeam from './screens/Team/MyTeam';
import Plans from './screens/Plans/Plans';
import ViewForm from './screens/Invoices/ViewForm';
import RequestTemplates from './screens/Invoices/Request/RequestTemplates';
import RequestPlan from './screens/Plans/RequestPlan';
import EditProfile from './screens/EditProfile';
import MemberInviteConfirmed from './screens/Team/Add/MemberInviteConfirmed';
import TRequestSentConfirmed from './screens/Invoices/Add/TRequestSentConfirmed';
import EditTeamMember from './screens/Team/Edit/EditTeamMember';
import DeleteConfirmed from './screens/Team/Edit/DeleteConfirmed';
import RequestSentConfirmed from './screens/Plans/RequestSentConfirmed';


const Stack = createStackNavigator();

const AppStack = () => {
  return(
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={Welcome}/>
      <Stack.Screen name="SignIn" component={SignIn}/>
      <Stack.Screen name="SetUp" component={SetUp}/>
      <Stack.Screen name="Home" component={Home}/>
      <Stack.Screen name="Forms" component={MyForms}/>
      <Stack.Screen name="My Team" component={MyTeam}/>
      <Stack.Screen name="Plans" component={Plans}/>
      <Stack.Screen name="Settings" component={Settings}/>
      <Stack.Screen name="MyTemplates" component={MyTemplates}/>
      <Stack.Screen name="NewTeamMember" component={NewTeamMember}/>
      <Stack.Screen name="ViewForm" component={ViewForm}/>
      <Stack.Screen name="RequestTemplates" component={RequestTemplates}/>
      <Stack.Screen name="RequestPlan" component={RequestPlan}/>
      <Stack.Screen name="EditProfile" component={EditProfile}/>
      <Stack.Screen name="MemberInviteConfirmed" component={MemberInviteConfirmed}/>
      <Stack.Screen name="TRequestSentConfirmed" component={TRequestSentConfirmed}/>
      <Stack.Screen name="EditTeamMember" component={EditTeamMember}/>
      <Stack.Screen name="DeleteConfirmed" component={DeleteConfirmed}/>
      <Stack.Screen name="RequestSentConfirmed" component={RequestSentConfirmed}/>
    </Stack.Navigator>
  );
};

const Navigation = () => {
  return(
    <NavigationContainer>
      <AppStack/>
    </NavigationContainer>
  );
};

export default Navigation;

