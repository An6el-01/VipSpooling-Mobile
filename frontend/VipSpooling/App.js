import 'react-native-get-random-values';
import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/store';
import Navigation from './Navigation'; 
import { Amplify } from 'aws-amplify';
import Constants from 'expo-constants';

console.log('Constants:', Constants);

const { awsRegion, userPoolId, userPoolWebClientId } = Constants.expoConfig.extra;

console.log('AWS_REGION: ', awsRegion)
console.log('USER_POOL_ID: ', userPoolId)
console.log('USER_POOL_WEB_CLIENT_ID: ', userPoolWebClientId)

//Configure Amplify with Cognito details
//Hide all this information so it is not in the repo
Amplify.configure({
    Auth:{
        region: awsRegion,
        userPoolId: userPoolId,
        userPoolWebClientId: userPoolWebClientId,
        mandatorySignIn: false, //Change Later??
        authenticationFlowType: 'USER_SRP_AUTH'
    },
});

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Navigation />
      </PersistGate>
    </Provider>
  );
};

export default App;

