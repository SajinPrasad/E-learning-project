import axios from "axios";

// Base URL for the API
const API_URL = "http://127.0.0.1:8000/";

// Create an Axios instance for general API requests
export const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Allows sending cookies with cross-site requests
  timeout: 50000, // Sets a timeout of 50 seconds for requests
  headers: {
    "Content-Type": "application/json", // Ensures JSON content type for requests
  },
});

// Create a separate Axios instance for private API requests
export const axiosPrivateInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 50000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add the Authorization header with the JWT token
axiosPrivateInstance.interceptors.request.use(
  (config) => {
    // Retrieve the access token from local storage
    const token = localStorage.getItem("accessToken");

    // If the token exists, add it to the request headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  },
);

// Response interceptor to handle errors, including token expiration and refresh
axiosPrivateInstance.interceptors.response.use(
  (response) => response, // Directly return the response if successful
  async (error) => {
    const originalRequest = error.config;

    // Check if the error status is 401 (Unauthorized) and if the request has not been retried yet
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark the request as retried

      try {
        // Retrieve the refresh token from local storage
        const refreshToken = JSON.parse(localStorage.getItem("REFRESH_TOKEN"));

        // Attempt to refresh the access token
        const response = await axios.post(`${API_URL}/token/refresh/`, {
          refresh: refreshToken,
        });

        // Save the new access token and refresh token in local storage
        localStorage.setItem("REFRESH_TOKEN", JSON.stringify(response.data));

        // Update the Authorization header with the new access token
        originalRequest.headers.Authorization = `Bearer ${response.data.access}`;

        // Retry the original request with the new access token
        return axiosInstance(originalRequest);
      } catch (err) {
        // If token refresh fails, clear tokens from local storage and redirect to login page
        localStorage.removeItem("REFRESH_TOKEN");
        window.location.href = "/login";
      }
    }

    // If the error is not related to token expiration, reject the promise with the error
    return Promise.reject(error);
  },
);
