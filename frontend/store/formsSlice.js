import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from '@reduxjs/toolkit';

const initialState = {
    forms: [],
    lastFetched: null,
    error: null,
    loading: false
};

const formsSlice = createSlice({
    name: 'forms',
    initialState,
    reducers: {
        setForms: (state, action) => {
            state.forms = action.payload;
            state.lastFetched = new Date().toISOString();
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearForms: (state) => {
            state.forms = [];
            state.lastFetched = null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase('forms/hydrate', (state, action) => {
            return {
                ...state,
                ...action.payload
            };
        });
    }
});

export const { setForms, setLoading, setError, clearForms } = formsSlice.actions;

// Memoized selector for forms
const selectForms = state => state.forms.forms;

// Memoized selector for sorted forms
export const selectSortedForms = createSelector(
    [selectForms],
    (forms) => {
        if (!forms || !Array.isArray(forms)) return [];
        return [...forms].sort((a, b) => {
            const dateA = a.InvoiceDate || a.FormDate;
            const dateB = b.InvoiceDate || b.FormDate;
            if (!dateA || !dateB) return 0;
            return new Date(dateB) - new Date(dateA);
        });
    }
);

export default formsSlice.reducer; 