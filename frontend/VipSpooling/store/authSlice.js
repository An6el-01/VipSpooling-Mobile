import { createSlice } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
    isAuthenticated: false,
    user: null,
    userGroups: [],
    userAttributes: {
        name: '',
        email: '',
        role: ''
    }
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth: (state, action) => {
            state.isAuthenticated = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setUserGroups: (state, action) => {
            state.userGroups = action.payload || [];
        },
        setUserAttributes: (state, action) => {
            state.userAttributes = action.payload || {
                name: '',
                email: '',
                role: ''
            };
        },
        clearAuth: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.userGroups = [];
            state.userAttributes = {
                name: '',
                email: '',
                role: ''
            };
        }
    }
});

const persistConfig = {
    key: 'auth',
    storage: AsyncStorage,
    whitelist: ['isAuthenticated', 'user', 'userGroups', 'userAttributes']
};

export const { setAuth, setUser, setUserGroups, setUserAttributes, clearAuth } = authSlice.actions;
export default persistReducer(persistConfig, authSlice.reducer);