import axios from "axios"
import { ACCESS_TOKEN } from "./constants"

// Create an Axios instance with the base URL from environment variables
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

// Add a request interceptor to include the access token in the Authorization header
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
)

export default api;