import axios from "axios";

// Base URL for the API
const API_URL = "http://127.0.0.1:8000/";

// Create an Axios instance for general API requests
export const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 50000,
  headers: {
    "Content-Type": "application/json",
  },
  xsrfCookieName: "csrftoken",
  xsrfHeaderName: "X-CSRFToken",
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({resolve, reject});
        }).then(token => {
          return axiosInstance(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await axiosInstance.post('/token/refresh/');
        console.log(refreshResponse)
        isRefreshing = false;
        processQueue(null, refreshResponse.data.access);
        
        // Assuming the new access token is returned in the response
        // You might need to adjust this based on your backend response
        axiosInstance.defaults.headers['Authorization'] = 'Bearer ' + refreshResponse.data.access;
        originalRequest.headers['Authorization'] = 'Bearer ' + refreshResponse.data.access;
        
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError, null);
        // Handle refresh token failure (e.g., redirect to login)
        // You might want to clear stored tokens and redirect to login page here
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);