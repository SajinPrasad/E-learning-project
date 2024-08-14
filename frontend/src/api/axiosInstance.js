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
