import axios from 'axios';
import router from '@/router';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

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

const logout = () => {
    localStorage.removeItem('token');
    router.push('/login');
};

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            logout();
            alert('Sesión expirada. Por favor, inicia sesión nuevamente.');
        }
        return Promise.reject(error);
    }
);

export default api;
