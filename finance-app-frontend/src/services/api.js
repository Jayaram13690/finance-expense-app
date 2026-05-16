import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: (name, email, password) =>
    api.post('/auth/register', { name, email, password }),
  login: (email, password) =>
    api.post('/auth/login', new URLSearchParams({ username: email, password }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }),
  getMe: () => api.get('/auth/me'),
};

export const transactionApi = {
  getTransactions: (page = 1, limit = 10) =>
    api.get('/transactions', { params: { skip: (page - 1) * limit, limit } }),
  getTransaction: (id) => api.get(`/transactions/${id}`),
  createTransaction: (data) => api.post('/transactions', data),
  updateTransaction: (id, data) => api.put(`/transactions/${id}`, data),
  deleteTransaction: (id) => api.delete(`/transactions/${id}`),
};

export const budgetApi = {
  getBudgets: () => api.get('/budgets'),
  createBudget: (data) => api.post('/budgets', data),
  updateBudget: (id, data) => api.put(`/budgets/${id}`, data),
  deleteBudget: (id) => api.delete(`/budgets/${id}`),
};

export const potApi = {
  getPots: () => api.get('/pots'),
  createPot: (data) => api.post('/pots', data),
  deposit: (id, amount) => api.patch(`/pots/${id}/deposit`, { amount }),
  withdraw: (id, amount) => api.patch(`/pots/${id}/withdraw`, { amount }),
  deletePot: (id) => api.delete(`/pots/${id}`),
};

export const dashboardApi = {
  getOverview: () => api.get('/dashboard/overview'),
};

export default api;
