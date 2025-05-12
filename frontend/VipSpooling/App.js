import 'react-native-get-random-values';
import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/store';
import Navigation from './Navigation'; 
import { Amplify } from 'aws-amplify';


const awsRegion = process.env.AWS_REGION;
const userPoolId = process.env.USER_POOL_ID;
const userPoolWebClientId = process.env.USER_POOL_WEB_CLIENT_ID;

console.log('AWS_REGION: ', awsRegion)
console.log('USER_POOL_ID: ', userPoolId)
console.log('USER_POOL_WEB_CLIENT_ID: ', userPoolWebClientId)

//Configure Amplify with Cognito details
Amplify.configure({
    Auth:{
        region: awsRegion,
        userPoolId: userPoolId,
        userPoolWebClientId: userPoolWebClientId,
        mandatorySignIn: true,
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

