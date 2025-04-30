// src/utils/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://ticket-booking-app-pfq1.onrender.com', // Update if deployed
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = token;
  return config;
});

export default API;
