import axios from "axios";
import { store } from "../store/store";
import { clearToken, setToken } from "../features/auth/authSlice";

// Base URL for the API
const API_URL = "http://127.0.0.1:8000/";

// Public Axios Instance (No Authentication)
export const publicAxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 50000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Private Axios Instance (Requires Authentication)
export const privateAxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 50000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to the private instance to include JWT token
privateAxiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.accessToken; // Fetching the access token from state.
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);


// Response interceptor to handle token expiration and refresh
privateAxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const state = await store.getState();
        const refreshToken = state.auth.refreshToken; // Fetching the refresh token from state.

        const response = await axios.post(`${API_URL}/token/refresh/`, {
          refresh: refreshToken,
        });

        // Update the token in Redux store
        store.dispatch(
          setToken({
            accessToken: response.data.access,
            refreshToken: response.data.refresh,
          }),
        );

        // Update the token in the request header
        privateAxiosInstance.defaults.headers["Authorization"] =
          `Bearer ${response.data.access}`;
        originalRequest.headers["Authorization"] =
          `Bearer ${response.data.access}`;

        return privateAxiosInstance(originalRequest);
      } catch (err) {
        console.error("Error refreshing token:", err.response || err.message);
        // store.dispatch(clearToken());
        // window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    console.error("Request failed:", error.response || error.message);
    return Promise.reject(error);
  },
);

export default privateAxiosInstance;
