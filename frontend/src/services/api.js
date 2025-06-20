// api.js
import axios from 'axios';


const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true
});

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  if (!token) throw new Error('Authentication token missing');
  return { 'Authorization': `Bearer ${token}` };
};

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const authService = {
  login: async (credentials) => {
    try {
      const response = await API.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    }
  },

  getProtectedData: async () => {
    try {
      const response = await API.get('/protected');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Request failed';
    }
  }
};

export { authService };
