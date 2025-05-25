const API_URL = process.env.API_URL || 'http://localhost:5000';

export const endpoints = {
    users: `${API_URL}/api/users`,
    createUser: `${API_URL}/api/users/create`,
    updateUser: `${API_URL}/api/users/update`,
    deleteUser: `${API_URL}/api/users/delete`,
    templates: `${API_URL}/api/templates`,
    pricingplans: `${API_URL}/api/pricingplans`,

    //** INVOICE FORMS */
    invoiceForms: `${API_URL}/api/dynamoDB/invoiceForms`,
    getAnInvoiceForm: `${API_URL}/api/dynamoDB/getAnInvoiceForm`,
    getAllInvoiceForms: `${API_URL}/api/dynamoDB/getAllInvoiceForms`,
    updateInvoiceForm: `${API_URL}/api/dynamoDB/updateInvoiceForm`,
    deleteInvoiceForm: `${API_URL}/api/dynamoDB/deleteInvoiceForm`,
    createInvoiceForm: `${API_URL}/api/dynamoDB/createInvoiceForm`,

    //** JSA FORMS */
    getAllJSAForms: `${API_URL}/api/dynamoDB/getAllJSAForms`,
    createJSAForm: `${API_URL}/api/dynamoDB/createJSAForm`,

    //** CAPILLARY FORMS */
    getAllCapillaryForms: `${API_URL}/api/dynamoDB/getAllCapillaryForms`,
    createCapillaryForm: `${API_URL}/api/dynamoDB/createCapillaryForm`,

    //** LAMBDA FUNCTIONS */
    generateWorkTicketID: `${API_URL}/api/lambda/generateWorkTicketID-Invoices`,
    generateWorkTicketIDJsa: `${API_URL}/api/lambda/generateWorkTicketID-Jsa`,
   
    //** EMAIL JS */
    sendRequestTemplate: `${API_URL}/api/email/sendRequestTemplate`,
}; 