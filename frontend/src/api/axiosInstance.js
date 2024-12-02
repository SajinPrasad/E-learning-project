import axios from "axios";

import { store } from "../store/store";
import { setToken } from "../features/auth/authSlice";
import { logoutUser } from "../features/auth/authActuion";

// Base URL for the API
const API_URL = "https://api.brainbridgelearning.shop";

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
let isRefreshing = false; // Flag to prevent multiple refreshes
let refreshSubscribers = []; // Queue to retry original requests
let refreshTokenFailed = false;

const onRefreshed = (accessToken) => {
  refreshSubscribers.forEach((callback) => callback(accessToken));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback) => {
  refreshSubscribers.push(callback);
};

privateAxiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.accessToken;
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

privateAxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      if (refreshTokenFailed) {
        // If the refresh token has failed, don't try again, proceed to logout
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Queue requests while token is being refreshed
        return new Promise((resolve) => {
          addRefreshSubscriber((accessToken) => {
            originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
            resolve(privateAxiosInstance(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const state = store.getState();
        const refreshToken = state.auth.refreshToken;

        const response = await axios.post(`${API_URL}/token/refresh/`, {
          refresh: refreshToken,
        });

        store.dispatch(
          setToken({
            accessToken: response.data.access,
            refreshToken: response.data.refresh,
          }),
        );

        privateAxiosInstance.defaults.headers["Authorization"] =
          `Bearer ${response.data.access}`;
        originalRequest.headers["Authorization"] =
          `Bearer ${response.data.access}`;

        onRefreshed(response.data.access);
        isRefreshing = false;

        return privateAxiosInstance(originalRequest);
      } catch (err) {
        isRefreshing = false;
        refreshTokenFailed = true; // Mark the refresh token as failed
        await store.dispatch(logoutUser());
        return Promise.reject(err);
      }
    }

    console.error("Request failed:", error.response || error.message);
    return Promise.reject(error);
  },
);

export default privateAxiosInstance;
