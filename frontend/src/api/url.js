import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "/api/auth/";//for production
// Separate instance ONLY for refresh — bypasses the interceptor
const REFRESH_URL = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

const BACKEND_URL = axios.create({
    baseURL : BASE_URL,
    withCredentials: true, // needed to send the refreshToken cookie
})

// Automatically attach the access token to every request
BACKEND_URL.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// If a request fails with 401, refresh the token and retry
BACKEND_URL.interceptors.response.use(
    (response) => response, // success — do nothing
    async (error) => {
        const originalRequest = error.config;

        // If 401 and we haven't already retried
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // mark so we don't loop

            try {
                // Call refresh-token — backend reads the httpOnly cookie automatically
                const res = await BACKEND_URL.get("/refresh-token");
                const newToken = res.data.accessToken;

                // Save the new token
                localStorage.setItem("accessToken", newToken);

                // Update the header and retry the original request
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return BACKEND_URL(originalRequest);
            } catch (refreshError) {
                // Refresh token also expired — force logout
                localStorage.removeItem("accessToken");
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default BACKEND_URL;