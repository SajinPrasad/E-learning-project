import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, CategoryDropdown } from "../common";
import { CloseIcon } from "../common/Icons";
import { createCourse } from "../../services/courseServices/courseService";

// Validation schema using Yup
const validationSchema = Yup.object({
  courseTitle: Yup.string().required("Course title is required"),
  courseDescription: Yup.string().required("Description is required"),
  courseCategory: Yup.string().required("Category is required"),
  courseRequirement: Yup.string().required("Requirements are required"),
  lessons: Yup.array()
    .of(
      Yup.object({
        lessonTitle: Yup.string().required("Lesson title is required"),
        lessonContent: Yup.string().required("Lesson content is required"),
      }),
    )
    .min(1, "At least one lesson is required"),
});

const CourseForm = ({ setAddCourse }) => {
  const courseCategories = useSelector((state) => state.courseCategory);
  // Convert courseCategories from object to array
  const categoriesArray = Object.values(courseCategories).filter(
    (category) => category.id !== undefined,
  );

  const email = useSelector((state) => state.user.email);

  const [videoPreview, setVideoPreview] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Select category");
  const [imagePreview, setImagePreview] = useState(null);

  const formik = useFormik({
    initialValues: {
      courseTitle: "",
      courseDescription: "",
      courseCategory: selectedCategory,
      courseRequirement: "",
      lessons: [],
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        console.log(values)
        // Calling the service function here
        const response = await createCourse(values);

        setAddCourse(false);
      } catch (error) {
        // Handle error response
        console.error("Error submitting course:", error);
      }
    },
  });

  useEffect(() => {
    formik.setFieldValue("courseCategory", selectedCategory);
  }, [selectedCategory]);

  const handleAddLesson = (e) => {
    e.preventDefault();
    const { lessonTitle, lessonContent } = formik.values;
    formik.setFieldValue("lessons", [
      ...formik.values.lessons,
      { lessonTitle, lessonContent, lessonVideo: videoPreview },
    ]);
    formik.setFieldValue("lessonTitle", "");
    formik.setFieldValue("lessonContent", "");
    setVideoPreview("");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        formik.setFieldValue('courseImage', file); // Set the file in formik
      };
      reader.readAsDataURL(file);
    }
  };
  

  const handleDeleteLesson = (lessonTitle) => {
    formik.setFieldValue(
      "lessons",
      formik.values.lessons.filter(
        (lesson) => lesson.lessonTitle !== lessonTitle,
      ),
    );
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setVideoPreview(previewUrl);
    }
  };

  const handleRemoveVideo = () => {
    setVideoPreview("");
  };

  return (
    <>
      <form
        onSubmit={formik.handleSubmit}
        className="mt-8 flex flex-col p-2 shadow"
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
            {/* <select
              name="courseCategory"
              value={formik.values.courseCategory}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`border-t-blue-gray-200 w-full rounded border bg-white p-3 text-sm placeholder-opacity-100 focus:border-theme-primary focus:outline-none ${
                formik.touched.courseCategory && formik.errors.courseCategory
                  ? "border-red-500"
                  : ""
              }`}
              required
            >
              <option value="" disabled>
                Select a category
              </option>
              {categoriesArray.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select> */}
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
            <div className="flex h-48 w-full md:w-1/3 cursor-pointer md:mt-6 items-center justify-center rounded-lg border border-dashed p-3">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e)}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="flex h-full w-full cursor-pointer items-center justify-center"
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Uploaded Preview"
                    className="h-full w-full rounded-lg object-cover"
                  />
                ) : (
                  <span className="text-blue-gray-600">
                    Click to upload a picture
                  </span>
                )}
              </label>
            </div>
          </div>
        </div>

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
                        src={lesson.lessonVideo}
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
          </div>
        )}

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
                  onClick={handleRemoveVideo}
                  className="absolute right-2 top-2 rounded-full bg-red-600 px-2 py-1 text-white hover:bg-red-700"
                >
                  Remove
                </button>
              </div>
            ) : (
              <label className="absolute inset-0 mt-2 flex cursor-pointer items-center justify-center">
                <p className="text-gray-500">Upload a video file</p>
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

        <div type={"submit"} className="m-auto mb-5">
          <Button text={"Submit Course"} />
        </div>
      </form>
    </>
  );
};

export default CourseForm;
