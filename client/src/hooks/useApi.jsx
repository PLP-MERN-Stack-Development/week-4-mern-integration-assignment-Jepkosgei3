import { useState } from 'react';
import axios from 'axios';

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = async (method, url, data = null) => {
    setLoading(true); // Set loading before the request
    try {
      const config = {
        method,
        url: `${import.meta.env.VITE_API_URL}${url}`,
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('token') && { Authorization: `Bearer ${localStorage.getItem('token')}` }),
        },
        data,
      };
      console.log('Request URL:', config.url); // Debug
      const response = await axios(config);
      setLoading(false);
      setError(null); // Clear error on success
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error occurred');
      setLoading(false);
      throw err; // Re-throw for upstream handling
    }
  };

  return { loading, error, request };
};

export default useApi;