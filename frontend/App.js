import 'react-native-get-random-values';
import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Navigation from './Navigation';
import { Amplify } from '@aws-amplify/core';
import { cognitoUserPoolsTokenProvider } from '@aws-amplify/auth/cognito';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadState } from './utils/storage';
import { ActivityIndicator, View, Text } from 'react-native';
import { ReduxErrorBoundary, default as ErrorBoundaryWrapper } from './components/ErrorBoundary';
import { awsConfig } from './config/aws-config';

// Configure Amplify with v6
try {
  console.log('Initializing Amplify...');
  Amplify.configure(awsConfig);
  cognitoUserPoolsTokenProvider.setKeyValueStorage(AsyncStorage);
  console.log('Amplify initialized successfully');
} catch (error) {
  console.error('Error initializing Amplify:', error);
}

const App = () => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const savedState = await loadState();
        if (savedState) {
          // Dispatch initial state to Redux store
          Object.entries(savedState).forEach(([key, value]) => {
            store.dispatch({ type: `${key}/hydrate`, payload: value });
          });
        }
        setIsReady(true);
      } catch (err) {
        console.error('Error initializing app:', err);
        setError(err.message);
      }
    };

    initializeApp();
  }, []);

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ color: 'red', textAlign: 'center' }}>
          Error initializing app: {error}
        </Text>
      </View>
    );
  }

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ReduxErrorBoundary>
      <Provider store={store}>
        <ErrorBoundaryWrapper>
          <Navigation />
        </ErrorBoundaryWrapper>
      </Provider>
    </ReduxErrorBoundary>
  );
};

export default App;

