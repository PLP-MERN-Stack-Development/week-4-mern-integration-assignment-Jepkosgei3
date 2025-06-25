// api.js - API service for making requests to the backend

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include token in requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData) => axiosInstance.post('/auth/register', userData),
  login: (userData) => axiosInstance.post('/auth/login', userData),
};

export const taskAPI = {
  getAll: () => axiosInstance.get('/tasks'),
  create: (taskData) => axiosInstance.post('/tasks', taskData),
  getOne: (id) => axiosInstance.get(`/tasks/${id}`),
  update: (id, taskData) => axiosInstance.put(`/tasks/${id}`, taskData),
  delete: (id) => axiosInstance.delete(`/tasks/${id}`),
};

export default axiosInstance;