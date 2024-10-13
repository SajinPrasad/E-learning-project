import { toast } from "react-toastify";

import privateAxiosInstance from "../../api/axiosInstance";

export const getWalletBalance = async () => {
  try {
    const response = await privateAxiosInstance.get("/wallet/");
    if (response.status >= 200 && response.status < 300) {
      return response.data; // Return the wallet balance
    }
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      const status = error.response.status;
      if (status >= 500) {
        toast.error("Server error, please try again later.");
      } else if (status >= 400) {
        toast.error("Client error, please check your request.");
      }
    } else if (error.request) {
      // The request was made but no response was received
      toast.error("Network error, please check your connection.");
    } else {
      // Something happened in setting up the request
      toast.error("An unexpected error occurred.");
    }
  }
};

export const getCourseProfitServices = async () => {
  try {
    const response = await privateAxiosInstance.get("/course-profits/");
    if (response.status >= 200 && response.status < 300) {
      return response.data; // Return the wallet balance
    }
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      const status = error.response.status;
      if (status >= 500) {
        toast.error("Server error, please try again later.");
      } else if (status >= 400) {
        toast.error("Client error, please check your request.");
      }
    } else if (error.request) {
      // The request was made but no response was received
      toast.error("Network error, please check your connection.");
    } else {
      // Something happened in setting up the request
      toast.error("An unexpected error occurred.");
    }
  }
};
