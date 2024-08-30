import { toast } from "react-toastify";
import { privateAxiosInstance } from "../../api/axiosInstance";

const createCourse = async (courseData) => {
  console.log("Course data", courseData);
  try {
    const response = await privateAxiosInstance.post("/courses/", {
      title: courseData.courseTitle,
      description: courseData.courseDescription,
      category: courseData.courseCategory, // Assuming this is a slug or ID that matches the category in the backend
      preview_image: courseData.courseImage,
      lessons: courseData.lessons.map((lesson, index) => ({
        title: lesson.lessonTitle,
        content: lesson.lessonContent,
        video_url: lesson.lessonVideo, // The video URL or path
        order: index + 1, // Ordering lessons
      })),
      requirements: {
        description: courseData.courseRequirement,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error creating course:", error);
    throw error;
  }
};

const getCourses = async () => {
  try {
    const response = await privateAxiosInstance.get("/courses/");
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      toast.error("Error while fetching Courses!");
    }
  } catch (error) {
    if (error.response) {
      // Handle client or server errors
      const statusCode = error.response.status;
      if (statusCode >= 400 && statusCode < 500) {
        toast.error("Request error. Please check your permissions.");
      } else if (statusCode >= 500) {
        toast.error("Server error. Please try again later.");
      }
    } else if (error.request) {
      // Handle no response from server
      toast.error(
        "No response received from server. Please check your network connection.",
      );
    } else {
      // Handle unexpected errors (e.g., network issues, etc.)
      toast.error("An unexpected error occurred. Please try again.");
    }
    throw error; // Rethrow the error to be handled by the calling code if necessary
  }
};

export { createCourse, getCourses };
