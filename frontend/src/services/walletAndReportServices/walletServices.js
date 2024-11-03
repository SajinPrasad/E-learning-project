import { toast } from "react-toastify";

import privateAxiosInstance from "../../api/axiosInstance";
import { handleCommonError } from "../commongErrorHandler";

export const getWalletBalance = async () => {
  try {
    const response = await privateAxiosInstance.get("/wallet/");
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    }
  } catch (error) {
    handleCommonError(error);
  }
};

export const getCourseProfitServices = async () => {
  try {
    const response = await privateAxiosInstance.get("/course-profits/");
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    }
  } catch (error) {
    handleCommonError(error);
  }
};

export const courseProfitDateFilter = async (from = null, to = null) => {
  try {
    let response;
    if (from && to) {
      response = await privateAxiosInstance.get(
        `/course-profits/date-filter?from=${from}&to=${to}`,
      );
    } else if (from) {
      response = await privateAxiosInstance.get(
        `/course-profits/date-filter?from=${from}`,
      );
    } else if (to) {
      response = await privateAxiosInstance.get(
        `/course-profits/date-filter?to=${to}`,
      );
    }

    return response.data;
    
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      if (status >= 500) {
        toast.error("Server error, please try again later.");
      } else if (status >= 400) {
        toast.error("Client error, please check your request.");
      }
    } else if (error.request) {
      toast.error("Network error, please check your connection.");
    } else {
      toast.error("An unexpected error occurred.");
    }
  }
};
