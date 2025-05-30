import axios from 'axios';

export const api = axios.create({
    baseURL: 'https://api-acai-delivey.onrender.com',
    //  baseURL: 'http://localhost:3000/',

});
