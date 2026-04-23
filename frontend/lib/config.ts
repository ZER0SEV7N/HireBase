//frontend/hirebase/lib/config.tsx
//Archivo de configuracion para la conexion con el backend
import axios from "axios";
export const API_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});
//Interceptores para requests y responses
//Puedes agregar interceptores para manejar tokens de autenticación, errores globales, etc.
api.interceptors.request.use(
    (config) => {
        //Comprobar el lado del cliente
        if(typeof window !== 'undefined'){
            const token = localStorage.getItem('auth_token');

            if(token)
                config.headers.Authorization = `Bearer ${token}`;

            if(config.data instanceof FormData)
                delete config.headers['Content-Type'];
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

//Interceptores para manejar respuestas, especialmente errores de autenticación
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('auth_token');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
