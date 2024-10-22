import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

import { Button, CategoryDropdown, Loading } from "../common";
import { Camera, CloseIcon, VideoIcon } from "../common/Icons";
import {
  createCourse,
  validateVideoFile,
} from "../../services/courseServices/courseService";
import { styles } from "../common";

// Validation schema using Yup
const validationSchema = Yup.object({
  courseTitle: Yup.string()
    .min(10, "Course title should be atleast 5 characters.")
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

async function showConfirmFreeCourseAlert() {
  return Swal.fire({
    title: "Are you sure?",
    text: "You are adding the course as a free course!",
    icon: "warning",
    showConfirmButton: true,
    showCancelButton: true,
    confirmButtonText: `Confirm`,
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

async function confirmCourseSubmission() {
  return Swal.fire({
    title: "Are you sure?",
    text: "You are about to submit a new course, make sure that everything perfect.",
    icon: "warning",
    showConfirmButton: true,
    showCancelButton: true,
    confirmButtonText: `Continue`,
    cancelButtonText: "Review again",
    background: "#fffff",
    customClass: {
      title: "text-black",
      popup: "my-popup-class",
      confirmButton: `${styles.confirmbutton}`,
      cancelButton: `${styles.cancelbutton}`,
    },
  }).then((result) => result.isConfirmed);
}

const CourseForm = ({ setAddCourse, refreshCourses }) => {
  const courseCategories = useSelector((state) => state.courseCategory);

  // Convert courseCategories from object to array
  const categoriesArray = Object.values(courseCategories).filter(
    (category) => category.id !== undefined,
  );

  const [videoPreview, setVideoPreview] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Select category");
  const [imagePreview, setImagePreview] = useState(null);
  const [isFreeCourse, setIsFreeCourse] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [videoFile, setVideoFile] = useState(null);

  const formik = useFormik({
    initialValues: {
      courseTitle: "",
      courseDescription: "",
      courseCategory: selectedCategory,
      courseRequirement: "",
      coursePrice: null,
      lessons: [],
      previewImage: null,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (values.lessons.length < 1) {
        toast.error("Atleast one lesson is required");
        return;
      }

      try {
        const submit = await confirmCourseSubmission();

        if (submit) {
          // Calling the service function here
          setIsLoading(true);
          const response = await createCourse(values);
          setAddCourse(false);
          refreshCourses(); // Refreshing the course list
          setIsLoading(false);
        } else {
          toast.warn("Course submission cancelled, Please review.");
        }
      } catch (error) {
        // Handle error response
        console.error("Error submitting course:", error);
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    formik.setFieldValue("courseCategory", selectedCategory);
  }, [selectedCategory]);

  // Validating the lesson details and adding the lessons to the form data
  const handleAddLesson = (e) => {
    e.preventDefault();
    const { lessonTitle, lessonContent } = formik.values;

    if (!lessonTitle || lessonTitle === "") {
      toast.error("Please enter valid title for the lesson.");
      return;
    } else if (!lessonContent || lessonContent === "") {
      toast.error("Please enter valid lesson content.");
      return;
    } else if (lessonContent.length < 200) {
      toast.error("Lesson content is too short.");
      return;
    }

    // Check if a lesson with the same title already exists
    const exists = formik.values.lessons.some(
      (lesson) => lesson.lessonTitle === lessonTitle,
    );

    if (exists) {
      toast.error("A lesson with the same name already exists.");
      return;
    }

    // Updating the lessons array in the form data.
    formik.setFieldValue("lessons", [
      ...formik.values.lessons,
      {
        lessonTitle,
        lessonContent,
        lessonVideoPreview: videoPreview,
        lessonVideo: videoFile,
      },
    ]);

    // Reset form fields and video state
    formik.setFieldValue("lessonTitle", "");
    formik.setFieldValue("lessonContent", "");
    setVideoFile(null);
    setVideoPreview("");
  };

  // Adding the image in the Formdata after validation.
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        formik.setFieldValue("previewImage", file); // Set the file in Formik
      };
      reader.readAsDataURL(file);
    } else {
      formik.setFieldValue("previewImage", null); // Clear field if no file is selected
    }
  };

  // Deleting lessons from Form data before submiting.
  const handleDeleteLesson = (lessonTitle) => {
    formik.setFieldValue(
      "lessons",
      formik.values.lessons.filter(
        (lesson) => lesson.lessonTitle !== lessonTitle,
      ),
    );
  };

  // Handling video file - setting up URL, form data after validating video
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setIsLoading(true);
        await validateVideoFile({ file, setIsLoading });
        setIsLoading(false);

        const previewUrl = URL.createObjectURL(file);
        setVideoPreview(previewUrl);
        setVideoFile(file);

        formik.setFieldValue("lessonVideo", file);
        formik.setFieldValue("lessonVideoPreview", previewUrl);
      } catch (error) {
        toast.error(error);
        // Reset file input
        e.target.value = "";
      }
    }
  };

  // Removing both image and video preview.
  const handleRemovePreview = (type) => {
    if (type === "image") {
      setImagePreview(null);
    } else if (type === "video") {
      setVideoPreview("");
    }
  };

  // Setting the course as free and changing the checkbox status
  const handleFreeCourseChange = async (e) => {
    const checked = e.target.checked;

    // If the checkbox is being checked, show confirmation alert
    if (checked) {
      const isConfirmed = await showConfirmFreeCourseAlert();
      if (isConfirmed) {
        setIsFreeCourse(true);
        formik.setFieldValue("coursePrice", 0.0);
      } else {
        e.target.checked = false; // Revert checkbox state
        setIsFreeCourse(false); // Update state if user cancels
        formik.setFieldValue("coursePrice", formik.values.coursePrice); // Restore previous price
      }
    } else {
      // If the checkbox is being unchecked, just update the state
      setIsFreeCourse(false);
      formik.setFieldValue("coursePrice", formik.values.coursePrice);
    }
  };

  return (
    <>
      {isLoading && <Loading />}
      <form
        onSubmit={formik.handleSubmit}
        className="mt-8 flex flex-col p-2 shadow"
        encType="multipart/form-data"
      >
        <div className="mb-6 flex flex-col items-end gap-4 md:flex-row">
          <div className="w-full">
            <label className="text-blue-gray-800 mb-2 text-sm font-medium">
              Course Title
            </label>
            <input
              value={formik.values.courseTitle}
              type="text"
              name="courseTitle"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Python - Basics to advanced..."
              className={`border-t-blue-gray-200 w-full rounded border p-3 text-sm placeholder-opacity-100 focus:border-theme-primary focus:outline-none ${
                formik.touched.courseTitle && formik.errors.courseTitle
                  ? "border-red-500"
                  : ""
              }`}
            />
            {formik.touched.courseTitle && formik.errors.courseTitle && (
              <div className="text-sm text-red-500">
                {formik.errors.courseTitle}
              </div>
            )}
          </div>
          <div className="w-full flex-col md:w-3/5">
            <p className="text-blue-gray-800 text-sm font-medium">
              Course Category
            </p>
            <CategoryDropdown
              categories={categoriesArray}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              setFieldValue={formik.setFieldValue}
            />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {/* Full-width Description */}
          <div className="w-full">
            <label className="text-blue-gray-800 mb-2 text-sm font-medium">
              Description
            </label>
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

          {/* Requirements and Picture Upload */}
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="w-full">
              <label className="text-blue-gray-800 mb-2 text-sm font-medium">
                Requirements
              </label>
              <textarea
                name="courseRequirement"
                value={formik.values.courseRequirement}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Anyone with basic understanding of..."
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

            {/* Picture Upload */}
            <div className="h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed p-3 md:mt-6 md:w-1/3">
              <input
                name="previewImage"
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e)}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="flex h-full w-full cursor-pointer flex-col items-center justify-center self-center"
              >
                {imagePreview ? (
                  <div className="relative h-full w-full">
                    <img
                      src={imagePreview}
                      alt="Uploaded Preview"
                      className="h-full w-full rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePreview("image")}
                      className="absolute right-2 top-2 rounded-full bg-red-600 bg-opacity-50 px-2 py-1 text-white hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <span className="text-blue-gray-600">
                    <Camera />
                  </span>
                )}
                {formik.errors.previewImage && (
                  <div className="mt-2 text-sm text-red-500">
                    {formik.errors.previewImage}
                  </div>
                )}
              </label>
            </div>
          </div>
        </div>

        {/* Listing the lessons */}
        <h5 className="text-blue-gray-900 text-lg font-semibold sm:text-xl">
          Lessons
        </h5>
        {formik.values.lessons.length > 0 && (
          <div className="flex-col">
            {formik.values.lessons.map((lesson, index) => (
              <div
                className="mb-4 w-full rounded border p-2"
                key={lesson.lessonTitle}
              >
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">
                    Lesson {index + 1}
                  </span>
                  <span
                    onClick={() => handleDeleteLesson(lesson.lessonTitle)}
                    className="cursor-pointer"
                  >
                    <CloseIcon />
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {lesson.lessonVideo && (
                    <div className="col-span-1">
                      <video
                        src={lesson.lessonVideoPreview}
                        controls
                        className="w-full rounded"
                      />
                    </div>
                  )}
                  <div
                    className={`col-span-2 ${lesson.lessonVideo ? "" : "col-span-3"}`}
                  >
                    <h3 className="mb-2 text-lg font-semibold">
                      {lesson.lessonTitle}
                    </h3>
                    <p className="text-sm">{lesson.lessonContent}</p>
                  </div>
                </div>
              </div>
            ))}
            {formik.touched.lessons && formik.errors.lessons && (
              <div className="text-sm text-red-500">
                {formik.errors.lessons}
              </div>
            )}
          </div>
        )}

        {/* Add lesson */}
        <div className="mb-6 flex flex-col items-end gap-4">
          <div className="w-full">
            <label className="text-blue-gray-800 mb-2 text-sm font-medium">
              Lesson Title
            </label>
            <div className="flex gap-4">
              <input
                value={formik.values.lessonTitle}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="lessonTitle"
                type="text"
                placeholder="Python - Basics to advanced..."
                className="border-t-blue-gray-200 w-full rounded border p-3 text-sm placeholder-opacity-100 focus:border-theme-primary focus:outline-none"
              />
              <span type={"button"} onClick={(e) => handleAddLesson(e)}>
                <Button bg={false} text={"Add Lesson"} />
              </span>
            </div>
            {formik.touched.lessonTitle && formik.errors.lessonTitle && (
              <div className="text-sm text-red-500">
                {formik.errors.lessonTitle}
              </div>
            )}
          </div>
        </div>
        <div className="mb-6 flex flex-col items-end gap-4 md:flex-row">
          <div className="w-full md:w-4/6">
            <label className="text-blue-gray-800 mb-2 text-sm font-medium">
              Content
            </label>
            <textarea
              value={formik.values.lessonContent}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name="lessonContent"
              placeholder="Enter your lesson content here..."
              className="border-t-blue-gray-200 h-48 w-full resize-none rounded-lg border p-3 focus:border-theme-primary focus:outline-none"
            />
            {formik.touched.lessonContent && formik.errors.lessonContent && (
              <div className="text-sm text-red-500">
                {formik.errors.lessonContent}
              </div>
            )}
          </div>
          <div className="border-t-blue-gray-200 relative mb-2 h-48 w-full resize-none overflow-hidden rounded-lg border p-3 hover:border-theme-primary hover:bg-gray-100 focus:border-theme-primary focus:outline-none md:w-1/3">
            {videoPreview ? (
              <div className="relative h-full w-full">
                <video
                  src={videoPreview}
                  controls
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemovePreview("video")}
                  className="absolute right-2 top-2 rounded-full bg-red-600 bg-opacity-50 px-2 py-1 text-white hover:bg-red-700"
                >
                  Remove
                </button>
              </div>
            ) : (
              <label className="absolute inset-0 mt-2 flex cursor-pointer items-center justify-center">
                <div className="flex flex-col items-center justify-center">
                  <span className="flex items-center justify-center">
                    <VideoIcon />
                  </span>
                  <p className="mt-2 text-sm text-gray-500">
                    Upload a video file
                  </p>
                </div>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
              </label>
            )}
          </div>
        </div>

        <div className="mb-6 w-full">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={isFreeCourse}
              onChange={handleFreeCourseChange}
              className="form-checkbox"
            />
            <span className="text-blue-gray-800 text-lg font-medium">
              Add as Free course
            </span>
          </label>
          <label
            className={`text-blue-gray-800 ${isFreeCourse ? "text-gray-400" : ""} mb-2 text-sm font-medium`}
          >
            Course Price (₹)
          </label>
          <input
            value={formik.values.coursePrice || ""} // Use empty string to handle clearing
            type="number"
            name="coursePrice"
            onChange={(e) => {
              // Update formik state with the new value
              const value = e.target.value;
              formik.setFieldValue(
                "coursePrice",
                value === "" ? "" : parseFloat(value),
              );
            }}
            onBlur={formik.handleBlur}
            placeholder="Enter the course price..."
            disabled={isFreeCourse} // Disable input if checkbox is checked
            className={`border-t-blue-gray-200 w-full rounded border ${isFreeCourse ? "border-gray-300" : ""} p-3 text-sm placeholder-opacity-100 focus:border-theme-primary focus:outline-none ${
              formik.touched.coursePrice && formik.errors.coursePrice
                ? "border-red-500"
                : ""
            }`}
          />
          {!isFreeCourse &&
            formik.touched.coursePrice &&
            formik.errors.coursePrice && (
              <div className="text-sm text-red-500">
                {formik.errors.coursePrice}
              </div>
            )}
        </div>

        <div type={"submit"} className="m-auto mb-5">
          <Button text={"Submit Course"} />
        </div>
      </form>
    </>
  );
};

export default CourseForm;
