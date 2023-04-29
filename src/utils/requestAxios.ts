import axios from 'axios';
import Cookies from 'js-cookie';

const request = axios.create({
    baseURL: 'http://localhost:8080/api',
    timeout: 1000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

request.interceptors.request.use(
    (config) => {
        config.headers['Authorization'] = 'Bearer ' + localStorage.getItem('token');
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

request.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        return Promise.reject(error);
    },
);


export default request;