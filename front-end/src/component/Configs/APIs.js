import axios from "axios"
import cookie from "react-cookies"

const BASE_URL = 'http://127.0.0.1:8000/'

export const endpoints = {
    'blogs': '/blogs/',
    'comment': '/comments/',
    'users': '/users/',
    'user': '/products/',
    'login': '/api/token/',
    'current-user': '/users/current-user/',
    'register': '/users/',
    'createblogs': '/blogs/',
}

export const authAPIs = () => {
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