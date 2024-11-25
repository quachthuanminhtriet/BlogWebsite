import axios from "axios"
import cookie from "react-cookies"

const BASE_URL = 'http://127.0.0.1:8000/';
const WS_BASE_URL = 'ws://127.0.0.1:8000/ws/'; 

export const endpoints = {
    'blogs': '/blogs/',
    'comments': '/comments/',
    'users': '/users/',
    'user': '/products/',
    'login': '/api/token/',
    'current-user': '/users/current-user/',
    'register': '/users/',
    'createblogs': '/blogs/',
    'toggle-like': (id) => `/blogs/${id}/toggle-like/`,
    'notifications': '/api/notifications/',
}

export const authAPIs = () => {
    const token = cookie.load('access-token');
    console.log('Token hiện tại:', token);
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            'Authorization': `Bearer ${cookie.load('access-token')}`
        }
    });
}

export default axios.create({
    baseURL: BASE_URL
});

export const WS_URL = WS_BASE_URL;