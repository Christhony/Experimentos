import axios from 'axios';

// Configura la URL base de tu backend
const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Cambia según sea necesario
    headers: {
        'Content-Type': 'application/json',
    },
});
export const loginUser = (credentials) => {
    return api.post('/users/login', credentials)
        .then(response => {
            console.log('Respuesta completa de login:', response);


            return response;  // Devuelve la respuesta completa
        })
        .catch(error => {
            console.error('Error de inicio de sesión:', error.response.data.error);
            throw error;
        });
};



export const getUserData = (userId) => {
    return api.get(`/users/${userId}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,  // Opcional: Si aún necesitas el token para verificar la autenticidad
        }
    });
};

