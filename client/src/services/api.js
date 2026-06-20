// API service helper - base URL for backend API calls
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiTest = async () => {
  const response = await fetch(`${API_BASE_URL}/test`);
  return response.json();
};

export default API_BASE_URL;
