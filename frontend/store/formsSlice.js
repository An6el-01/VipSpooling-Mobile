import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from '@reduxjs/toolkit';

const initialState = {
    forms: [],
    lastFetched: null,
    error: null,
    loading: false,
    userRole: null,
    userName: null
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
        },
        setUserInfo: (state, action) => {
            state.userRole = action.payload.role;
            state.userName = action.payload.name;
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

export const { setForms, setLoading, setError, clearForms, setUserInfo } = formsSlice.actions;

// Memoized selector for forms
const selectForms = state => state.forms.forms;
const selectUserRole = state => state.forms.userRole;
const selectUserName = state => state.forms.userName;

// Memoized selector for sorted and filtered forms
export const selectSortedForms = createSelector(
    [selectForms, selectUserRole, selectUserName],
    (forms, userRole, userName) => {
        console.log('Filtering forms with:', { userRole, userName });
        
        if (!forms || !Array.isArray(forms)) return [];

        let filteredForms = forms;
        
        // Apply role-based filtering
        if (userRole === 'Operator') {
            console.log('Applying Operator filtering');
            filteredForms = forms.filter(form => {
                const shouldInclude = (() => {
                    switch (form._typename) {
                        case 'Invoice Form':
                            console.log('Checking Invoice Form:', {
                                formId: form.WorkTicketID,
                                spooler: form.Spooler,
                                userName,
                                matches: form.Spooler === userName
                            });
                            return form.Spooler === userName;
                        case 'JSA Form':
                            console.log('Checking JSA Form:', {
                                formId: form.WorkTicketID,
                                createdBy: form.CreatedBy,
                                userName,
                                matches: form.CreatedBy === userName
                            });
                            return form.CreatedBy === userName;
                        case 'Capillary Form':
                            console.log('Checking Capillary Form:', {
                                formId: form.WorkTicketID,
                                technician: form.TechnicianName,
                                userName,
                                matches: form.TechnicianName === userName
                            });
                            return form.TechnicianName === userName;
                        default:
                            console.log('Unknown form type:', form._typename);
                            return false;
                    }
                })();

                if (!shouldInclude) {
                    console.log('Filtering out form:', {
                        type: form._typename,
                        id: form.WorkTicketID
                    });
                }

                return shouldInclude;
            });
        }

        // console.log('Forms after filtering:', filteredForms);

        // Sort the filtered forms by date
        const sortedForms = [...filteredForms].sort((a, b) => {
            const dateA = a.InvoiceDate || a.FormDate || a.Date;
            const dateB = b.InvoiceDate || b.FormDate || b.Date;
            if (!dateA || !dateB) return 0;
            return new Date(dateB) - new Date(dateA);
        });

        console.log('Forms after sorting:', sortedForms);

        return sortedForms;
    }
);

export default formsSlice.reducer; 