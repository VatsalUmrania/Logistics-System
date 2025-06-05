import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth Services
export const authService = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData)
};

// Commodity Services
export const commodityService = {
    getAllCommodities: () => api.get('/inventory'),
    getCommodityById: (id) => api.get(`/inventory/${id}`),
    createCommodity: (data) => api.post('/inventory', data),
    updateCommodity: (id, data) => api.put(`/inventory/${id}`, data),
    deleteCommodity: (id) => api.delete(`/inventory/${id}`)
};

// Client Services
export const clientService = {
    getAllClients: () => api.get('/clients'),
    getClientById: (id) => api.get(`/clients/${id}`),
    createClient: (data) => api.post('/clients', data),
    updateClient: (id, data) => api.put(`/clients/${id}`, data),
    deleteClient: (id) => api.delete(`/clients/${id}`)
};

// Order Services
export const orderService = {
    getAllOrders: () => api.get('/orders'),
    getOrderById: (id) => api.get(`/orders/${id}`),
    createOrder: (data) => api.post('/orders', data),
    updateOrder: (id, data) => api.put(`/orders/${id}`, data),
    deleteOrder: (id) => api.delete(`/orders/${id}`)
};

export default api;