import { toast } from "react-toastify";
import privateAxiosInstance from "../../api/axiosInstance";

export const getReceiverProfileService = async (receiverId) => {
  try {
    const response = await privateAxiosInstance.get(
      `/receiver-profile/?receiverId=${receiverId}`,
    );

    if (response.status >= 200 && response.status <= 301) {
      return response.data;
    }
  } catch (error) {
    if (error.response) {
      const status = error.response.status;

      if (status >= 500) {
        toast.error("Internal server error, Please try again later.");
      } else if (status === 404) {
        toast.error("User not found");
      }
    } else if (error.request) {
      toast.error("Please check your network connection");
    }
  }
};

export const getChatListService = async (receiverId) => {
  try {
    const response = await privateAxiosInstance.get(
      `/messages/?receiverId=${receiverId}`,
    );

    if (response.status >= 200 && response.status <= 301) {
      return response.data;
    }
  } catch (error) {
    if (error.response) {
      const status = error.response.status;

      if (status >= 500) {
        toast.error("Internal server error, Please try again later.");
      } else if (status === 404) {
        toast.error("User not found");
      }
    } else if (error.request) {
      toast.error("Please check your network connection");
    }
  }
};

// export const sendMessageService = async (receiverId, message) => {
//   try {
//     const response = await privateAxiosInstance.post(`/send-message/`, {
//       receiverId,
//       message,
//       is_read: false,
//     });
//     if (response.status >= 200 && response.status <= 301) {
//       return response.data;
//     }
//   } catch (error) {
//     if (error.response) {
//       const status = error.response.status;

//       if (status === 400) {
//         const errorMessage = error.response.data?.detail || "An error occurred";
//         toast.error(errorMessage);
//       } else if (status >= 500) {
//         toast.error("Internal server error, Please try again later.");
//       } else if (status === 404) {
//         toast.error("User not found");
//       }
//     } else if (error.request) {
//       toast.error("Please check your network connection");
//     }
//   }
// };

export const getChatProfileService = async () => {
  try {
    const response = await privateAxiosInstance.get(`/chat-profiles/`);

    if (response.status >= 200 && response.status <= 301) {
      console.log("The response: ", response)
      return response.data;
    }
  } catch (error) {
    if (error.response) {
      const status = error.response.status;

      if (status >= 500) {
        toast.error("Internal server error, Please try again later.");
      } else if (status === 404) {
        toast.error("User not found");
      }
    } else if (error.request) {
      toast.error("Please check your network connection");
    }
  }
};
