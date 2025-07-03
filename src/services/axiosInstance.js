import axios from "axios";
import { refreshToken, logout } from "../features/users/authSlice";
import store from "../store/store";
import toast from "react-hot-toast";

let refreshPromise = null;

const addAuthInterceptor = (axiosInstance) => {
    // Request Interceptor
    axiosInstance.interceptors.request.use(
        (config) => {
            const state = store.getState();
            const accessToken = state?.token?.accessToken;

            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }

            return config;
        },
        (error) => Promise.reject(error)
    );

    // Response Interceptor
    axiosInstance.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;

            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                // Initiate or wait for ongoing refresh token request
                if (!refreshPromise) {
                    refreshPromise = store.dispatch(refreshToken())
                        .unwrap()
                        .finally(() => {
                            refreshPromise = null;
                        });
                }

                try {
                    const newAccessToken = await refreshPromise;

                    if (newAccessToken) {
                        originalRequest.headers.Authorization = `Bearer ${newAccessToken.accessToken}`;
                        return axiosInstance(originalRequest);
                    }
                } catch (err) {
                    toast.error("Session expired. Please log in again.");
                    store.dispatch(logout());
                    return Promise.reject(err);
                }
            }

            return Promise.reject(error);
        }
    );
};

// Axios instance configuration
const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'ngrok-skip-browser-warning': '69420',
    },
});

// Add interceptor
addAuthInterceptor(axiosClient);

export default axiosClient;