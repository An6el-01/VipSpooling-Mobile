const API_URL = process.env.API_URL || 'http://localhost:5000';

export const endpoints = {
    users: `${API_URL}/api/users`,
    templates: `${API_URL}/api/templates`,
    // Add other endpoints here as needed
}; 