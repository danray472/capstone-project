// API service helper - base URL for backend API calls
const DEFAULT_RENDER_API_URL = 'https://capstone-project-pojk.onrender.com/api';

const resolveApiBaseUrl = () => {
  const configuredUrl = import.meta.env.VITE_API_URL?.trim();
  if (configuredUrl) {
    return configuredUrl.replace(/\/+$/, '');
  }

  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:5000/api';
    }
  }

  return DEFAULT_RENDER_API_URL;
};

const API_BASE_URL = resolveApiBaseUrl();

export const apiTest = async () => {
  const response = await fetch(`${API_BASE_URL}/test`);
  return response.json();
};

export default API_BASE_URL;
