import React, { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

import {
  updateCreateCourseSuggestion,
  getCourseDetails,
  updateCourseStatus,
  mentorChangingSuggestionStatus,
  getFullLessonData,
  courseDeleteService,
  updateCourse,
} from "../../services/courseServices/courseService";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Loading, ReactStarsWrapper } from "../common";
import { DeleteIcon, EditIcon, PlusIcon } from "../common/Icons";
import { CourseStatusChange, courseStyles } from "./";
import { styles } from "../common";
import { getAverageCourseRatingService } from "../../services/courseServices/reviewService";
import { ListReviews } from "../Reviews";
import Lessons from "./Lessons";

/**
 * @param {*} newStatus - The updated status.
 * @returns Alert box to confirm the status change of the course by admin.
 */
async function confirmCourseStatusChange(newStatus) {
  return Swal.fire({
    title: "Are you sure?",
    text: `Changing course status to ${newStatus}`,
    icon: "warning",
    showConfirmButton: true,
    showCancelButton: true,
    confirmButtonText: `Continue`,
    cancelButtonText: "Cancel",
    background: "#fffff",
    customClass: {
      title: "text-black",
      popup: "my-popup-class",
      confirmButton: `${styles.confirmbutton}`,
      cancelButton: `${styles.cancelbutton}`,
    },
  }).then((result) => result.isConfirmed);
}

async function confirmCourseDeletion() {
  return Swal.fire({
    title: "Are you sure?",
    text: `After deletion course will not be available for purchase. 
          Users who are purchased already will still recieve the course.`,
    icon: "warning",
    showConfirmButton: true,
    showCancelButton: true,
    confirmButtonText: `Delete`,
    cancelButtonText: "Cancel",
    background: "#fffff",
    customClass: {
      title: "text-black",
      popup: "my-popup-class",
      confirmButton: `${styles.confirmbutton}`,
      cancelButton: `${styles.cancelbutton}`,
    },
  }).then((result) => result.isConfirmed);
}

// Validation schema using Yup
const validationSchema = Yup.object({
  courseTitle: Yup.string()
    .min(5, "Course title should be atleast 5 characters.")
    .required("Course title is required"),
  courseDescription: Yup.string()
    .min(200, "Course descriptions should contain atleast 200 characters.")
    .required("Description is required"),
  courseCategory: Yup.string().required("Category is required"),
  courseRequirement: Yup.string()
    .min(100, "Course title should contain atleast 100 characters.")
    .required("Requirements are required"),
  previewImage: Yup.mixed()
    .required("Preview image is required.")
    .test("fileType", "Unsupported File Format", (value) => {
      if (!value) return false;
      const allowedFormats = ["image/jpeg", "image/png", "image/webp"];
      return allowedFormats.includes(value.type);
    })
    .test("fileSize", "File size must be between 10KB and 8MB", (value) => {
      if (!value) return false;
      const maxSize = 8 * 1024 * 1024; // 8MB in bytes
      const minSize = 10 * 1024; // 10KB in bytes
      return value.size >= minSize && value.size <= maxSize;
    }),
  coursePrice: Yup.number()
    .required("Course price is required.")
    .positive("Course price must be a positive number.")
    .min(0.0, "Course price must be at least $0.00"),
});

/**
 * @param {*} param0 role - User role to identify admin or mentor
 * @returns Component which renders the course details for the admins and Mentors
 * Renders course according to role
 */
const CourseDetail = ({ role }) => {
  const { id } = useParams(); // Course id fetching.
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStatusChangeOpen, setIsStatusChangeOpen] = useState(false);
  const [suggestionText, setSuggestionText] = useState("");
  const [suggestion, setSuggestion] = useState({});
  const [suggestionStatus, setSuggestionStatus] = useState(false);
  const [courseRating, setCourseRating] = useState({});
  const navigate = useNavigate();
  const [editingField, setEditingField] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Select category");
  const [selectedItem, setSelectedItem] = useState("courseDetails");

  const formik = useFormik({
    initialValues: {
      courseTitle: "",
      courseDescription: "",
      courseCategory: selectedCategory,
      courseRequirement: "",
      coursePrice: null,
      previewImage: null,
    },
    validationSchema: validationSchema,
  });

  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        const courseDetails = await getCourseDetails(id);
        setCourse(courseDetails);
        if (courseDetails.suggestions) {
          setSuggestion(courseDetails.suggestions);
          setSuggestionText(courseDetails.suggestions.suggestion_text); // Setting the initial

          setSuggestionStatus(courseDetails.suggestions.is_done);
        }
      } catch (error) {
        console.error("Error fetching course details:", error);
      } finally {
        setIsLoading(false); // Make sure loading state is updated
      }
    };

    const fetchCourseRating = async () => {
      const fetchedRating = await getAverageCourseRatingService(id);
      setCourseRating(fetchedRating);
    };

    fetchCourseDetail();
    fetchCourseRating();
  }, [id]);

  // Function to handle opening the modal
  const handleOpenStatusChange = () => {
    setIsStatusChangeOpen(true);
  };

  // Function to handle closing the modal
  const handleCloseStatusChange = () => {
    setIsStatusChangeOpen(false);
  };

  // Function to handle status change and API call
  const handleStatusChange = async (newStatus) => {
    let submit;

    // Checking wether the current status and updated status are same.
    if (newStatus === course.status) {
      submit = false;
    } else {
      submit = await confirmCourseStatusChange(newStatus);
    }

    if (submit) {
      try {
        const response = await updateCourseStatus(course.id, newStatus);

        if (response) {
          // Update the course state with the new status
          setCourse((prevCourse) => ({
            ...prevCourse,
            status: newStatus,
          }));
          toast.success("Course status updated successfully.");
        } else {
          toast.error("Failed to update course status.");
        }
      } catch (error) {
        console.error("Error updating course status:", error);
      }
    }
    handleCloseStatusChange();
  };

  const handleCourseDeletion = async () => {
    const submit = await confirmCourseDeletion();

    if (submit) {
      setIsLoading(true);
      const courseDeleted = await courseDeleteService(id);

      if (courseDeleted) {
        setIsLoading(false);
        navigate("/mentor/courses");
      } else {
        return;
      }
    } else {
      return;
    }
  };

  // Function to update or create the course suggestions
  const handleUpdateCreateCourseSuggestion = async () => {
    try {
      let updatedSuggestion;
      if (course.suggestions) {
        updatedSuggestion = {
          ...suggestion,
          suggestion_text: suggestionText,
        };
        await updateCreateCourseSuggestion("put", updatedSuggestion, course.id);
      } else {
        updatedSuggestion = { suggestion_text: suggestionText };
        await updateCreateCourseSuggestion(
          "post",
          updatedSuggestion,
          course.id,
        );
      }
      setSuggestion(updatedSuggestion);
    } catch (error) {
      console.error("Error updating course suggestion:", error);
    }
  };

  const handleSuggestionStatusChange = async () => {
    flushSync(() => {
      setSuggestionStatus((prev) => !prev);
      setSuggestion((prevSuggestion) => ({
        ...prevSuggestion,
        is_done: suggestionStatus,
      }));
    });

    try {
      await mentorChangingSuggestionStatus(suggestion);
    } catch (error) {
      console.log("Error while updating the suggestion status: ", error);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      formik.setFieldValue("previewImage", file);
      const imageUrl = URL.createObjectURL(file); // Create a temporary URL for the uploaded image

      setCourse((prevCourse) => ({
        ...prevCourse,
        preview_image: imageUrl, // Update the preview_image field with the new image URL
      }));
    }
  };

  const handleImageEditClick = () => {
    document.getElementById("imageUpload").click();
    setEditingField("previewImage");
  };

  const handleSetEditingField = (field, value) => {
    formik.setFieldValue(field, value);
    setEditingField(field);
  };

  // Function which calls the service function to update the given field.
  // Updating the sate also with the updated value.
  const handleEditCourse = async (field, value) => {
    // Check if it's a nested field (like "requirements.description")
    const fieldParts = field.split(".");

    if (fieldParts.length === 2) {
      // For nested fields, e.g., "requirements.description"
      const [parentField, subField] = fieldParts;

      if (course[parentField][subField] === value) {
        setEditingField("");
        return;
      }

      // Call the update service function (you may need to adjust this based on your API)
      const courseUpdated = await updateCourse(id, parentField, value);

      if (courseUpdated) {
        setCourse((prevCourse) => ({
          ...prevCourse,
          [parentField]: {
            ...prevCourse[parentField],
            [subField]: value,
          },
        }));
        setEditingField("");
      }
    } else {
      // For simple fields, e.g., "description"
      if (course[field] === value) {
        setEditingField("");
        return;
      }

      // Call the update service function
      const courseUpdated = await updateCourse(id, field, value);

      if (courseUpdated) {
        const fetchedValue = courseUpdated[field];
        if (fetchedValue) {
          setCourse((prevCourse) => ({
            ...prevCourse,
            [field]: fetchedValue,
          }));
        } else {
          setCourse((prevCourse) => ({
            ...prevCourse,
            [field]: value,
          }));
        }

        setEditingField("");
      }
    }
  };

  // Handle loading state
  if (isLoading) {
    return <Loading />; // Optional loading component
  }

  // Handle case when course is not yet available
  if (!course) {
    return <p>Course details not available.</p>;
  }

  return (
    <>
      {/* Course details */}
      {selectedItem === "courseDetails" && (
        <>
          <div className="relative mt-10 hidden w-full items-center bg-[#4a4129] p-6 text-white md:flex md:flex-row">
            {/* Free Badge */}
            {course.price.amount === "0.00" && (
              <span className="absolute left-0 top-0 m-4 rounded bg-slate-300 bg-opacity-45 p-2 font-sentinent-medium-italic">
                * Free *
              </span>
            )}

            {/* Left Section: Title and Mentor Info */}
            <div className="ml-4 flex w-full flex-col gap-1 md:w-1/2">
              <p className="text-sm text-white">{course.category_path}</p>
              {editingField === "courseTitle" ? (
                <div className="flex gap-2">
                  <input
                    value={formik.values.courseTitle}
                    type="text"
                    name="courseTitle"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter new title"
                    className={`border-t-blue-gray-200 w-5/6 rounded border bg-transparent p-3 text-sm placeholder-opacity-100 focus:border-theme-primary focus:outline-none ${
                      formik.touched.courseTitle && formik.errors.courseTitle
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                  <div>
                    <h1
                      onClick={() =>
                        handleEditCourse("title", formik.values.courseTitle)
                      }
                      className="mt-2 cursor-pointer text-xs font-semibold text-blue-600"
                    >
                      Save
                    </h1>
                    <h1
                      onClick={() => setEditingField("")}
                      className="mt-2 cursor-pointer text-xs font-semibold text-gray-200"
                    >
                      Cancel
                    </h1>
                  </div>
                </div>
              ) : (
                <h1 className="flex flex-col gap-1 text-3xl font-bold text-white md:text-4xl">
                  {course.title}{" "}
                  {role === "mentor" && (
                    <span
                      onClick={() =>
                        handleSetEditingField("courseTitle", course.title)
                      }
                      className="cursor-pointer"
                    >
                      <EditIcon />
                    </span>
                  )}
                </h1>
              )}

              <p className="text-md mt-2 text-white">{course.mentor_name}</p>
              {courseRating && (
                <div className="flex cursor-pointer items-end gap-2">
                  <h4 className="font-sentinent-medium text-lg text-yellow-400">
                    <a href="#reviews">{courseRating?.average_rating}</a>
                  </h4>
                  <a href="#reviews">
                    <ReactStarsWrapper
                      edit={false}
                      value={courseRating?.average_rating}
                      size={22}
                    />
                  </a>
                  <span className="self-center text-xs text-blue-100">
                    <a href="#reviews">
                      (
                      {courseRating?.total_reviews
                        ? `${courseRating?.total_reviews} ratings`
                        : "No ratings yet"}
                      )
                    </a>
                  </span>
                </div>
              )}
              <span className="mt-4 font-sentinent-bold text-2xl text-white">
                ₹ {course.price.amount}
              </span>
            </div>

            {/* Right Section: Preview Image */}
            <div className="relative mt-4 w-full md:mt-0 md:w-1/2">
              <img
                src={course.preview_image}
                alt={course.title}
                className="h-56 w-full rounded-lg object-cover shadow-lg"
              />

              {/* Edit Icon with hidden file input */}
              {editingField === "previewImage" ? (
                <div>
                  <h1
                    onClick={() =>
                      handleEditCourse(
                        "preview_image",
                        formik.values.previewImage,
                      )
                    }
                    className="absolute right-2 top-2 z-10 mt-2 flex w-10 cursor-pointer items-center justify-center rounded bg-black py-2 text-xs font-semibold text-white"
                  >
                    Save
                  </h1>
                  <h1
                    onClick={() => setEditingField("")}
                    className="absolute right-2 top-14 z-10 flex w-10 cursor-pointer items-center justify-center rounded bg-black py-2 text-xs font-semibold text-white"
                  >
                    Cancel
                  </h1>
                </div>
              ) : (
                <span
                  className="absolute right-2 top-2 z-10 flex w-10 cursor-pointer items-center justify-center rounded bg-black py-2"
                  onClick={handleImageEditClick} // Trigger the file input
                >
                  <EditIcon />
                </span>
              )}

              {/* Hidden file input for uploading an image */}
              <input
                type="file"
                id="imageUpload"
                className="hidden"
                accept="image/*"
                onChange={(e) => handleImageUpload(e)} // Function to handle the uploaded image
              />
            </div>
          </div>

          <div className="relative mx-auto w-4/5 flex-col md:hidden">
            <div className="relative">
              <img
                src={course.preview_image}
                alt={course.title}
                className="h-52 w-full rounded-lg object-cover shadow-lg"
              />
              <span className="absolute right-2 top-2 z-10 flex w-10 cursor-pointer items-center justify-center rounded bg-black py-2">
                <EditIcon />
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
              {course.title}
            </h1>
            <p className="text-sm">{course.mentor_name}</p>
            <span className="sm:2xl mt-4 font-sentinent-bold text-xl">
              ₹ {course.price.amount}
            </span>
          </div>

          {/* Course status */}
          {role && (
            <div className="mx-auto mt-3 flex w-4/5 flex-col justify-start gap-2 rounded border border-gray-200 md:w-full md:flex-row">
              <div className="flex-col border-r border-gray-200">
                <div className="mt-4 w-48 px-6">
                  <h3 className="text-lg font-bold md:text-2xl">
                    Course Status
                  </h3>
                  <p
                    className={`w-1/2 ${courseStyles[course.status]} mb-2 p-2 text-center text-sm font-bold`}
                  >
                    {course.status.charAt(0).toUpperCase() +
                      course.status.slice(1)}{" "}
                    {/* Capitalize the first letter */}
                  </p>
                </div>
                {role === "admin" && (
                  <>
                    <div
                      onClick={handleOpenStatusChange}
                      className="mb-3 mt-3 w-[13.5rem] px-6"
                    >
                      <Button bg={false} text={"Change course status"} />
                    </div>
                    {/* The status change window */}
                    <CourseStatusChange
                      isOpen={isStatusChangeOpen}
                      onClose={handleCloseStatusChange}
                      onSubmit={handleStatusChange}
                      currentStatus={course.status}
                    />
                  </>
                )}
              </div>

              {/** Adding course suggestions, Only for admins */}
              {role === "admin" && (
                <div className="m-2 w-full flex-col justify-end md:justify-start">
                  <div>
                    <p className="text-md mt-1 flex max-w-fit cursor-pointer items-center gap-1 font-bold text-gray-500 hover:text-theme-primary md:text-lg">
                      Add Suggestion
                      <span>
                        <PlusIcon />
                      </span>
                    </p>
                  </div>

                  {suggestion ? (
                    <div className="flex flex-col md:flex-row">
                      <textarea
                        value={suggestionText} // Controlled value from state
                        onChange={(e) => setSuggestionText(e.target.value)}
                        className="border-t-blue-gray-200 h-32 w-4/5 resize-none rounded-lg border p-3 focus:border-theme-primary focus:outline-none"
                        placeholder="Enter your suggestion here..."
                      />

                      <div className="flex-col">
                        <div
                          onClick={handleUpdateCreateCourseSuggestion}
                          className="ml-2 mt-2 md:mt-0"
                        >
                          <Button text={"Submit"} />
                        </div>
                        {suggestion.suggestion_text && (
                          <div
                            className={`text-md ml-2 mt-3 rounded font-bold ${suggestion.is_done ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700"} text-center`}
                          >
                            <h1>{suggestion.is_done ? "Done" : "Not done"}</h1>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col md:flex-row">
                      <textarea
                        onChange={(e) => setSuggestionText(e.target.value)}
                        className="border-t-blue-gray-200 h-32 w-4/5 resize-none rounded-lg border p-3 focus:border-theme-primary focus:outline-none"
                        placeholder="Enter your suggestion here..."
                      />
                      <div
                        onClick={handleUpdateCreateCourseSuggestion}
                        className="ml-2 mt-2 md:mt-0"
                      >
                        <Button text={"Submit"} />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/** Suggestions displayed for mentor, they can mark as done. */}
              {role === "mentor" && (
                <div className="m-2 w-full flex-col justify-end md:justify-start">
                  <div className="flex w-2/3 justify-start">
                    <p className="mt-1 flex max-w-fit cursor-pointer items-center gap-1 text-lg font-bold text-gray-900">
                      Suggestions
                    </p>
                  </div>

                  {/* Wrap the suggestion text and checkbox in a flex container */}
                  {suggestionText && (
                    <div className="flex flex-col items-start justify-start gap-2 md:flex-row">
                      <h3 className="border-t-blue-gray-200 h-32 w-4/5 resize-none rounded-lg border p-3">
                        {suggestionText}
                      </h3>

                      {/* Checkbox container */}
                      <div className="mt-4 w-32 md:mt-0">
                        <input
                          type="checkbox"
                          id="choose-me"
                          className="peer hidden"
                          checked={suggestionStatus}
                          onChange={handleSuggestionStatusChange}
                        />
                        <label
                          htmlFor="choose-me"
                          className="md:text-md flex cursor-pointer select-none items-center justify-center rounded border-2 border-gray-500 px-3 py-2 text-sm font-bold text-gray-700 transition-colors duration-200 ease-in-out peer-checked:border-green-200 peer-checked:bg-green-200 peer-checked:text-green-900"
                        >
                          <span>Mark as Done</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {role === "mentor" && (
            <button
              onClick={handleCourseDeletion}
              className="mt-5 flex cursor-pointer items-center justify-center gap-2 rounded bg-slate-300 p-2 text-xs font-semibold text-gray-600"
            >
              <span>{<DeleteIcon />}</span>
              Delete this course
            </button>
          )}
        </>
      )}

      {/* Fields for chosing between lessons and course details*/}
      {selectedItem === "courseDetails" && (
        <div className="text-md my-8 flex cursor-pointer justify-around font-bold text-gray-400">
          <h4
            className={`${selectedItem === "courseDetails" && "border-b-2 border-gray-800 text-gray-800"} cursor-pointer`}
            onClick={() => setSelectedItem("courseDetails")}
          >
            Course Details
          </h4>
          <h4
            className={`${selectedItem === "lessons" && "border-b-2 border-gray-800 text-gray-800"} cursor-pointer`}
            onClick={() => setSelectedItem("lessons")}
          >
            Lessons
          </h4>
        </div>
      )}

      {selectedItem === "courseDetails" && (
        <div className="mx-auto bg-white p-6 shadow-md md:mt-4">
          {/* Course description */}
          {editingField === "courseDescription" ? (
            <div className="flex justify-between gap-2">
              <div className="w-full">
                <textarea
                  name="courseDescription"
                  value={formik.values.courseDescription}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter your text here..."
                  className={`border-t-blue-gray-200 h-48 w-full resize-none rounded-lg border p-3 focus:border-theme-primary focus:outline-none ${
                    formik.touched.courseDescription &&
                    formik.errors.courseDescription
                      ? "border-red-500"
                      : ""
                  }`}
                />
                {formik.touched.courseDescription &&
                  formik.errors.courseDescription && (
                    <div className="text-sm text-red-500">
                      {formik.errors.courseDescription}
                    </div>
                  )}
              </div>
              <div>
                <h1
                  onClick={() =>
                    handleEditCourse(
                      "description",
                      formik.values.courseDescription,
                    )
                  }
                  className="mt-2 cursor-pointer text-xs font-semibold text-blue-600"
                >
                  Save
                </h1>
                <h1
                  onClick={() => setEditingField("")}
                  className="mt-2 cursor-pointer text-xs font-semibold text-gray-700"
                >
                  Cancel
                </h1>
              </div>
            </div>
          ) : (
            <div className="flex justify-between">
              <div className="mt-1">
                <h2 className="text-lg font-bold md:text-2xl">Description</h2>
                <h5 className="text-gray-700">{course.description}</h5>
              </div>

              {role === "mentor" && (
                <span
                  onClick={() =>
                    handleSetEditingField(
                      "courseDescription",
                      course.description,
                    )
                  }
                  className="cursor-pointer"
                >
                  <EditIcon />
                </span>
              )}
            </div>
          )}

          {/* Course requirement */}
          <div className="mt-6 md:mt-3">
            {editingField === "courseRequirement" ? (
              <div className="flex justify-between gap-2">
                <div className="w-full">
                  <textarea
                    name="courseRequirement"
                    value={formik.values.courseRequirement}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter your text here..."
                    className={`border-t-blue-gray-200 h-48 w-full resize-none rounded-lg border p-3 focus:border-theme-primary focus:outline-none ${
                      formik.touched.courseRequirement &&
                      formik.errors.courseRequirement
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                  {formik.touched.courseRequirement &&
                    formik.errors.courseRequirement && (
                      <div className="text-sm text-red-500">
                        {formik.errors.courseRequirement}
                      </div>
                    )}
                </div>
                <div>
                  <h1
                    onClick={() =>
                      handleEditCourse(
                        "requirements.description",
                        formik.values.courseRequirement,
                      )
                    }
                    className="mt-2 cursor-pointer text-xs font-semibold text-blue-600"
                  >
                    Save
                  </h1>
                  <h1
                    onClick={() => setEditingField("")}
                    className="mt-2 cursor-pointer text-xs font-semibold text-gray-700"
                  >
                    Cancel
                  </h1>
                </div>
              </div>
            ) : (
              <div className="flex justify-between">
                <div className="mt-1">
                  <h2 className="text-lg font-bold md:text-2xl">
                    Requirements
                  </h2>
                  <h5 className="text-gray-700">
                    {course.requirements.description}
                  </h5>
                </div>

                {role === "mentor" && (
                  <span
                    onClick={() =>
                      handleSetEditingField(
                        "courseRequirement",
                        course.requirements.description,
                      )
                    }
                    className="cursor-pointer"
                  >
                    <EditIcon />
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Reviews and rating */}
          <div id="reviews" className="mb-5 bg-white p-8 shadow-md">
            <h2 className="mb-3 text-lg font-bold md:text-2xl">
              Reviews and rating
            </h2>
            <div className="flex items-center gap-2">
              <ReactStarsWrapper
                size={50}
                value={courseRating?.average_rating}
                edit={false}
              />
              <span className="text-sm text-blue-500">
                (
                {courseRating?.total_reviews
                  ? `${courseRating?.total_reviews} ratings`
                  : "No ratings yet"}
                )
              </span>
            </div>
            <h2 className="text-xl font-bold text-yellow-700 sm:text-2xl md:text-3xl">
              {courseRating?.average_rating} Course Ratings
            </h2>

            <div className="mt-8">
              <ListReviews courseId={id} />
            </div>
          </div>
        </div>
      )}

      {selectedItem === "lessons" && (
        <div className="mt-10">
          <Lessons
            lessons={course.lessons}
            courseId={id}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
          />
        </div>
      )}
    </>
  );
};

export default CourseDetail;
