import { toast } from "react-toastify";

import privateAxiosInstance, {
  publicAxiosInstance,
} from "../../api/axiosInstance";

export const postCommentService = async (courseId, comment) => {
  try {
    const response = await privateAxiosInstance.post(
      `/comments/?course_id=${courseId}`,
      {
        course: courseId, // Pass the course ID from the frontend
        comment: comment, // The actual comment text
      },
    );

    if (response.status >= 200 && response.status < 301) {
      toast.success("Added comment");
      return response.data;
    }
  } catch (error) {
    console.log(error);
  }
};

export const getCommentsService = async (courseId) => {
  try {
    const response = await privateAxiosInstance.get(
      `/comments/?course_id=${courseId}`,
    );

    if (response.status >= 200 && response.status < 301) {
      return response.data;
    }
  } catch (error) {
    console.error(error);
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
    console.error(error);
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
    console.error(error);
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
    console.error(error);
  }
};
