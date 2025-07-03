import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true
});

// Always attach the JWT token from localStorage or sessionStorage to every request
API.interceptors.request.use((config) => {
  // Try both localStorage and sessionStorage for flexibility
  const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken') || localStorage.getItem('token') || sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add error handling
API.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Handle unauthorized error
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const voucherService = {
  getAccountData: async () => {
    const response = await API.get('/journal-vouchers/account-data');
    return response.data;
  },
  getVouchers: async () => {
    const response = await API.get('/journal-vouchers');
    return response.data;
  },
  getSubAccounts: async (headId) => {
    const response = await API.get(`/journal-vouchers/sub-accounts/${headId}`);
    return response.data;
  },
  createVoucher: async (voucherData) => {
    const response = await API.post('/journal-vouchers', voucherData);
    return response.data;
  },
  getNextVoucherNo: async () => {
    const response = await API.get('/journal-vouchers/next-voucher-no');
    return response.data;
  }
};

export { API, voucherService };