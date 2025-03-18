import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isAuthenticated: false,
        accessToken: null,
        idToken: null,
        refreshToken: null,
        user: null,
    },
    reducers: {
        setAuth: (state, action) => {
            state.isAuthenticated = true;
            state.accessToken = action.payload.accessToken;
            state.idToken = action.payload.idToken;
            state.refreshToken = action.payload.refreshToken;
            state.user = action.payload.user || null;
        },
        clearAuth: (state) => {
            state.isAuthenticated = false;
            state.accessToken = null;
            state.idToken = null;
            state.refreshToken = null;
            state.user = null;
        },
    },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;