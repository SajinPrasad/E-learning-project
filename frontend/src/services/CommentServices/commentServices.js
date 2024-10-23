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
  console.log("Course id: ", courseId)
  try {
    const response = await privateAxiosInstance.get(
      `/comments/?course_id=${courseId}`,
    );

    console.log("Response: ", response)

    if (response.status >= 200 && response.status < 301) {
      return response.data;
    }
  } catch (error) {
    console.error(error);
  }
};
