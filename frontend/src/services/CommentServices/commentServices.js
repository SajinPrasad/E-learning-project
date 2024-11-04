import privateAxiosInstance, {
  publicAxiosInstance,
} from "../../api/axiosInstance";
import { handleCommonError } from "../commongErrorHandler";

export const getCommentsService = async (courseId) => {
  try {
    const response = await privateAxiosInstance.get(
      `/comments/?course_id=${courseId}`,
    );

    if (response.status >= 200 && response.status < 301) {
      return response.data;
    }
  } catch (error) {
    handleCommonError(error);
  }
};

export const getProfilePictureService = async (userId) => {
  try {
    const response = await publicAxiosInstance.get(
      `/profile-picture/?user_id=${userId}`,
    );

    if (response.status >= 200 && response.status < 301) {
      return response.data;
    }
  } catch (error) {
    handleCommonError(error);
  }
};

export const getParentCommentsService = async (courseId) => {
  try {
    const response = await privateAxiosInstance.get(
      `/parent-comments/?course_id=${courseId}`,
    );

    if (response.status >= 200 && response.status < 301) {
      return response.data;
    }
  } catch (error) {
    handleCommonError(error);
  }
};

export const getReplayCommentsService = async (courseId, parentId) => {
  try {
    const response = await privateAxiosInstance.get(
      `/parent-comments/?course_id=${courseId}&parent_id=${parentId}`,
    );

    if (response.status >= 200 && response.status < 301) {
      return response.data;
    }
  } catch (error) {
    handleCommonError(error);
  }
};
