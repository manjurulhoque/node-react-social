import axios from "axios";

const AxiosConfig = axios.create({
    baseURL: "http://localhost:8800/api",
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to add the token to all requests
AxiosConfig.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle token expiration
AxiosConfig.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // If the error is due to an expired token (401 Unauthorized)
        if (error.response && error.response.status === 401) {
            // Remove the token from localStorage
            localStorage.removeItem("token");
            // Redirect to login page
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default AxiosConfig;