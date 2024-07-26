// src/utils/api.js

import axios from 'axios';

// Base URL from environment variable
const BASE_URL = `${import.meta.env.VITE_BASE_URL}/api`;

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to get the token from local storage
const getToken = () => localStorage.getItem('token');

// Function to add token to headers
const addTokenToHeaders = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// Function to handle requests without token
const requestWithoutToken = (method, url, data = null) => {
  return axiosInstance({
    method,
    url,
    data,
  });
};

// Function to handle requests with token
const requestWithToken = (method, url, data = null) => {
  const token = getToken();
  return axiosInstance({
    method,
    url,
    data,
    ...addTokenToHeaders(token),
  });
};

// Exported functions for API calls
const api = {
  get: (url, requireAuth = false) => (requireAuth ? requestWithToken('get', url) : requestWithoutToken('get', url)),
  post: (url, data, requireAuth = false) => (requireAuth ? requestWithToken('post', url, data) : requestWithoutToken('post', url, data)),
  put: (url, data, requireAuth = false) => (requireAuth ? requestWithToken('put', url, data) : requestWithoutToken('put', url, data)),
  delete: (url, requireAuth = false) => (requireAuth ? requestWithToken('delete', url) : requestWithoutToken('delete', url)),
};

export default api;
