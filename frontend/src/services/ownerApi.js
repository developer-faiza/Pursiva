import axios from 'axios';

const OWNER_API = axios.create({
  baseURL: 'http://localhost:5000'
});

OWNER_API.interceptors.request.use(config => {
  const token = localStorage.getItem('ownerToken');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default OWNER_API;
