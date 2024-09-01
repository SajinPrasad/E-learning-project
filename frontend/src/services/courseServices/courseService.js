import { toast } from "react-toastify";
import { privateAxiosInstance } from "../../api/axiosInstance";

// Service for creating courses.
const createCourse = async (courseData) => {
  const {
    courseTitle,
    courseDescription,
    previewImage,
    courseCategory,
    coursePrice,
    courseRequirement,
    lessons,
  } = courseData;

  const formData = new FormData();
  formData.append("title", courseTitle);
  formData.append("description", courseDescription);
  formData.append("category", courseCategory);
  formData.append("preview_image", previewImage);
  formData.append("price_amount", coursePrice);

  formData.append(
    "requirements",
    JSON.stringify({ description: courseRequirement }),
  );

  // Append lessons data, but serialize non-file fields to JSON
  lessons.forEach((lesson, index) => {
    formData.append(`lessons[${index}][title]`, lesson.lessonTitle);
    formData.append(`lessons[${index}][content]`, lesson.lessonContent);
    formData.append(`lessons[${index}][order]`, index + 1);
    formData.append(`lessons[${index}][video_file]`, lesson.lessonVideo);
  });

  try {
    const response = await privateAxiosInstance.post("/courses/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.status >= 200 && response.status < 300) {
      return response.data; // Return the response data including tokens and user information
    } else {
      toast.error("Unexpected error!");
    }
  } catch (error) {
    if (error.response) {
      if (error.response.data.non_field_errors) {
        toast.error(error.response.data.non_field_errors[0]);
      }
    } else if (error.request) {
      toast.error("An error occurred during course creation.");
    } else {
      console.log(error);
    }
    throw error;
  }
};

// Service for fetching Courses.
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

/**
 * Fetching the course details only for admins and mentors.
 * Contains additional information like suggestion and status.
 * @param {*} id - Id of the course
 */
const getCourseDetailsAdminMentor = async (id) => {
  try {
    const response = await privateAxiosInstance.get(`/course/${id}/`);
    // Check if the response indicates a successful retreval
    if (response.status >= 200 && response.status < 300) {
      return response.data; // Return the response data including tokens and user information
    } else {
      toast.error("Unexpected error!");
    }
  } catch (error) {
    console.error(error);
  }
};

const validateVideoFile = ({ file, setIsLoading }) => {
  return new Promise((resolve, reject) => {
    setIsLoading(true);

    // Check if file exists
    if (!file) {
      toast.error("No file selected.");
      setIsLoading(false);
      reject("No file selected");
      return;
    }

    // Check file type (MIME type)
    const allowedTypes = ["video/mp4"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type. Please select an MP4 video.");
      setIsLoading(false);
      reject("Invalid file type");
      return;
    }

    // Check file size (example: between 100KB and 20MB)
    const minSize = 100 * 1024; // 100KB in bytes
    const maxSize = 20 * 1024 * 1024; // 20MB in bytes
    if (file.size < minSize || file.size > maxSize) {
      toast.error(
        `File size must be between ${minSize / (1024 * 1024)}MB and ${maxSize / (1024 * 1024)}MB.`
      );
      setIsLoading(false);
      reject("File size out of range");
      return;
    }

    // FileReader to check the file's magic number (first few bytes)
    const reader = new FileReader();
    reader.onloadend = (e) => {
      const arr = new Uint8Array(e.target.result).subarray(0, 8); // Read more bytes for better signature checks
      let header = "";
      for (let i = 0; i < arr.length; i++) {
        header += arr[i].toString(16).padStart(2, "0"); // Ensure hex is padded correctly
      }

      // Validate against known MP4 signatures
      const mp4Signatures = [
        "0000001866747970", // ftyp (18-byte offset)
        "0000002066747970", // ftyp (32-byte offset)
        "66747970",         // 'ftyp' box (default)
        // Add more signatures if needed
      ];

      const isValid = mp4Signatures.some(signature => header.startsWith(signature));
      if (isValid) {
        resolve(file);
      } else {
        reject("Invalid file format");
      }
      setIsLoading(false); // Set loading state to false after validation
    };

    reader.onerror = () => {
      setIsLoading(false);
      reject("Error reading file");
    };

    // Read the first few bytes of the file to check the signature
    reader.readAsArrayBuffer(file.slice(0, 8)); // Read more bytes for better signature checks
  });
};


export {
  createCourse,
  getCourses,
  getCourseDetailsAdminMentor,
  validateVideoFile,
};
