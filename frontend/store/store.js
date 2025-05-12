import { configureStore } from "@reduxjs/toolkit";
import themeReducer from './themeSlice';
import authReducer from './authSlice';
import formsReducer from './formsSlice';
import { saveState } from '../utils/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'app_state';

export const store = configureStore({
    reducer: {
        theme: themeReducer,
        auth: authReducer,
        forms: formsReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types
                ignoredActions: ['auth/hydrate', 'theme/hydrate', 'forms/hydrate'],
                // Ignore these field paths in all actions
                ignoredActionPaths: ['payload.tokens', 'payload.user'],
                // Ignore these paths in the state
                ignoredPaths: ['auth.user', 'forms.lastFetched'],
            },
        }),
    devTools: process.env.NODE_ENV !== 'production',
});

// Subscribe to store changes
let debounceTimer;
store.subscribe(() => {
    const state = store.getState();
    
    // Clear storage if logging out
    if (state.auth.isAuthenticated === false && state.auth.accessToken === null) {
        console.log('Clearing AsyncStorage due to logout...');
        clearTimeout(debounceTimer);
        AsyncStorage.removeItem(STORAGE_KEY)
            .then(() => console.log('AsyncStorage cleared successfully'))
            .catch(error => console.error('Error clearing AsyncStorage:', error));
        return;
    }

    // Debounce the save operation for other state changes
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        // Only save if authenticated
        if (state.auth.isAuthenticated) {
            saveState({
                auth: state.auth,
                theme: state.theme,
                forms: state.forms
            });
        }
    }, 1000); // Wait for 1 second of no changes before saving
});