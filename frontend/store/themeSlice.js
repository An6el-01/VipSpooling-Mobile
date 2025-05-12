import { createSlice } from '@reduxjs/toolkit';

const themeSlice = createSlice({
    name: 'theme',
    initialState: {
        isDarkMode: false, //default is light mode
    },
    reducers: {
        toggleTheme: (state) => {
            state.isDarkMode = !state.isDarkMode;
        },
    },
    extraReducers: (builder) => {
        builder.addCase('theme/hydrate', (state, action) => {
            return {
                ...state,
                ...action.payload
            };
        });
    }
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;