import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isAuthenticated: false,
    accessToken: null,
    idToken: null,
    refreshToken: null,
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
            const { accessToken, idToken, refreshToken, isAuthenticated } = action.payload;
            state.accessToken = accessToken;
            state.idToken = idToken;
            state.refreshToken = refreshToken;
            state.isAuthenticated = isAuthenticated;
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
            return initialState;
        }
    },
    extraReducers: (builder) => {
        builder.addCase('auth/hydrate', (state, action) => {
            return {
                ...state,
                ...action.payload
            };
        });
    }
});

export const { setAuth, setUser, setUserGroups, setUserAttributes, clearAuth } = authSlice.actions;
export default authSlice.reducer;