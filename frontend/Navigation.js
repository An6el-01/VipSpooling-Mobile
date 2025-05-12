import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { enableScreens } from 'react-native-screens';

// Import initial screens directly
import Welcome from './screens/Onboarding/Welcome';
import SignIn from './screens/Onboarding/SignIn';
import Home from './screens/Home';
import LoadingScreen from './components/LoadingScreen';
import ErrorBoundaryWrapper from './components/ErrorBoundary';

// Enable native screen containers
enableScreens();

const Stack = createNativeStackNavigator();

// Create a wrapper for lazy loaded screens
const createLazyScreen = (importFunc) => {
  const LazyComponent = React.lazy(importFunc);
  
  return function WrappedLazyComponent(props) {
    const [retryKey, setRetryKey] = React.useState(0);
    
    return (
      <ErrorBoundaryWrapper onRetry={() => setRetryKey(k => k + 1)}>
        <React.Suspense fallback={<LoadingScreen />}>
          <LazyComponent key={retryKey} {...props} />
        </React.Suspense>
      </ErrorBoundaryWrapper>
    );
  };
};

// Create lazy-loaded screen components
const SetUpScreen = createLazyScreen(() => import('./screens/Onboarding/SetUp'));
const FormsScreen = createLazyScreen(() => import('./screens/Invoices/MyForms'));
const MyTeamScreen = createLazyScreen(() => import('./screens/Team/MyTeam'));
const PlansScreen = createLazyScreen(() => import('./screens/Plans/Plans'));
const SettingsScreen = createLazyScreen(() => import('./screens/Settings'));
const MyTemplatesScreen = createLazyScreen(() => import('./screens/Invoices/MyTemplates'));
const ViewFormScreen = createLazyScreen(() => import('./screens/Invoices/ViewForm'));
const EditProfileScreen = createLazyScreen(() => import('./screens/EditProfile'));

const AppStack = () => {
  return(
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: 'transparent' }
      }}
    >
      <Stack.Screen name="Welcome" component={Welcome}/>
      <Stack.Screen name="SignIn" component={SignIn}/>
      <Stack.Screen name="SetUp" component={SetUpScreen} />
      <Stack.Screen name="Home" component={Home}/>
      <Stack.Screen name="Forms" component={FormsScreen} />
      <Stack.Screen name="My Team" component={MyTeamScreen} />
      <Stack.Screen name="Plans" component={PlansScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="MyTemplates" component={MyTemplatesScreen} />
      <Stack.Screen name="ViewForm" component={ViewFormScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="RequestTemplates" component={createLazyScreen(() => import('./screens/Invoices/Request/RequestTemplates'))} />
      <Stack.Screen name="AddJsaForm" component={createLazyScreen(() => import('./screens/Invoices/Add/AddJsaForms'))} />
      <Stack.Screen name="AddInvoiceForm" component={createLazyScreen(() => import('./screens/Invoices/Add/AddInvoiceForm'))} />
      <Stack.Screen name="AddCapillaryForm" component={createLazyScreen(() => import('./screens/Invoices/Add/AddCapillaryForm'))} />
      <Stack.Screen name="TRequestSentConfirmed" component={createLazyScreen(() => import('./screens/Invoices/Request/TRequestSentConfirmed'))} />
      <Stack.Screen name="NewTeamMember" component={createLazyScreen(() => import('./screens/Team/Add/NewTeamMember'))} />
      <Stack.Screen name="RequestPlan" component={createLazyScreen(() => import('./screens/Plans/RequestPlan'))} />
      <Stack.Screen name="RequestSentConfirmed" component={createLazyScreen(() => import('./screens/Plans/RequestSentConfirmed'))} />
      <Stack.Screen name="MemberInviteConfirmed" component={createLazyScreen(() => import('./screens/Team/Add/MemberInviteConfirmed'))} />
      <Stack.Screen name="EditTeamMember" component={createLazyScreen(() => import('./screens/Team/Edit/EditTeamMember'))} />
      <Stack.Screen name="DeleteConfirmed" component={createLazyScreen(() => import('./screens/Team/Edit/DeleteConfirmed'))} />
      
     
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

