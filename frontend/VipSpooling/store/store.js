import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import themeReducer from './themeSlice';
import authReducer from './authSlice';

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['auth', 'theme'],
    timeout: 10000, // 10 seconds timeout
    writeFailHandler: (err) => {
        console.error('Error persisting state:', err);
    }
};

const rootReducer = combineReducers({
    theme: themeReducer,
    auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
            immutableCheck: false, // Disable immutable state checks in development
        }),
    devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);