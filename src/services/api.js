
import axios from 'axios';
import {auth} from './auth'

const api = axios.create({
  // baseURL: 'http://localhost:5000/api',
  // timeout: 20000

  baseURL:' https://movizio.onrender.com/api',
  timeout: 20000
});

// Request interceptor - attach token
api.interceptors.request.use(
  (config) => {
    const token = auth.token || localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)


export default api;