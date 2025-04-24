const API_URL = process.env.API_URL || 'http://localhost:5000';

export const endpoints = {
    users: `${API_URL}/api/users`,
    templates: `${API_URL}/api/templates`,
    pricingplans: `${API_URL}/api/pricingplans`,
    invoiceForms: `${API_URL}/api/dynamoDB/invoiceForms`,
    getAnInvoiceForm: `${API_URL}/api/dynamoDB/getAnInvoiceForm`,
    getAllInvoiceForms: `${API_URL}/api/dynamoDB/getAllInvoiceForms`,
    updateInvoiceForm: `${API_URL}/api/dynamoDB/updateInvoiceForm`,
    deleteInvoiceForm: `${API_URL}/api/dynamoDB/deleteInvoiceForm`,
    getAllJSAForms: `${API_URL}/api/dynamoDB/getAllJSAForms`,

    // Add other endpoints here as needed
}; 