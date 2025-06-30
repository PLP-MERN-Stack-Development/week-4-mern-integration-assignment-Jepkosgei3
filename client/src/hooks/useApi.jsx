import { useState } from 'react';
import axios from 'axios';

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = async (method, endpoint, data = null) => {
    setLoading(true);
    console.log(`Loading set to true - Method: ${method}, Endpoint: ${endpoint}, Data:`, data);

    try {
      const isCodespace = window.location.host.includes('github.dev');
      const baseURL = isCodespace
        ? `https://${window.location.host.replace('5173', '5001')}/api`
        : 'http://localhost:5001/api';

      const url = `${baseURL}${endpoint}`;
      console.log(`API Request - Method: ${method}, URL: ${url}, Data:`, data);
      const token = localStorage.getItem('token');
      console.log('API Request Token:', token);

      const response = await axios({
        method,
        url,
        data,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        timeout: 20000,
        withCredentials: true,
      });

      console.log('API Response:', response.data);
      return response.data;
    } catch (err) {
      console.error('API Error:', {
        message: err.message,
        code: err.code,
        url: err.config?.url,
        status: err.response?.status,
        response: err.response?.data,
        stack: err.stack, // Add stack trace for debugging
      });

      let errorMessage = 'Network Error - Could not connect to server';
      if (err.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out. Check if the backend is running and the URL is correct.';
      } else if (err.response) {
        if (err.response.status === 401) {
          errorMessage = 'Unauthorized: Please log in again.';
          localStorage.removeItem('token');
        } else {
          errorMessage = err.response.data?.message || err.message;
        }
      }

      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
      console.log('Loading set to false in finally block - Method:', method, 'Endpoint:', endpoint);
    }
  };

  return { loading, error, request, setError };
};

export default useApi;