import axios from 'axios';

export const api = axios.create({
    baseURL: 'https://api-acai-delivey.onrender.com', // sua API pública
});
