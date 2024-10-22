import React, { useState } from "react";
import { toast } from "react-toastify";
// Make sure SweetAlert2 is properly imported
import Swal from "sweetalert2/dist/sweetalert2.js";
// Don't forget to import the CSS if you're not already doing so somewhere else
import "sweetalert2/dist/sweetalert2.css";

import { CloseIcon, VideoIcon } from "../common/Icons";
import { Button } from "../common";
import {
  addNewLessonsService,
  validateVideoFile,
} from "../../services/courseServices/courseService";

const confirmAddingLessons = () => {
  return Swal.fire({
    title: "Are you sure?",
    text: "Adding new lessons to the course!",
    icon: "warning",
    showConfirmButton: true,
    showCancelButton: true,
    confirmButtonText: "Continue",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#3085d6", // Add explicit colors
    cancelButtonColor: "#d33",
    background: "#ffffff",
    customClass: {
      title: "text-black",
      popup: "my-popup-class",
      confirmButton: "swal2-confirm-button",
      cancelButton: "swal2-cancel-button",
    },
  }).then((result) => result.isConfirmed);
};

/**
 * 
 * @param {number} courseId - course id
 * @param {function name(array) {
    function for updating the lessons which are added currently to the 
    existing lessons array.
 }} 
 * @param {function} setIsAddingNewLesson - Function which sets the state of showing the
      form to add lessons
 * @param {function} setIsVideoLoading - Function for setting the video loading state.
 * @returns 
 */
const AddLessonForm = ({
  courseId,
  handleUpdateLessonList,
  setIsAddingNewLesson,
  setIsVideoLoading,
}) => {
  const [lesson, setLesson] = useState({
    title: "",
    content: "",
    lesson_preview: "",
    video_file: null,
  });
  const [lessons, setLessons] = useState([]);
  const [videoPreview, setVideoPreview] = useState("");

  const handleLessonInputChange = (e) => {
    const { name, value } = e.target;
    setLesson((prevLesson) => ({
      ...prevLesson,
      [name]: value,
    }));
  };

  // Adding the lessons to state, before submiting to the backend.
  const handleAddLesson = (e) => {
    e.preventDefault(); // Prevent default form submission
    console.log("Before validation: ", lesson); // Check lesson state

    // Validation check
    if (!lesson.title.trim()) {
      toast.error("Please enter a lesson title");
      return;
    }

    console.log("Adding lesson: ", lesson); // Confirm function execution

    setLessons((prevLessons) => [...prevLessons, lesson]);
    setLesson({
      title: "",
      content: "",
      lesson_preview: "",
      video_file: null,
    });
    setVideoPreview("");
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setIsVideoLoading(true); // Add loading state
        await validateVideoFile({ file, setIsLoading: setIsVideoLoading });

        const previewUrl = URL.createObjectURL(file);
        setVideoPreview(previewUrl);
        setLesson((prevLesson) => ({
          ...prevLesson,
          lesson_preview: previewUrl,
          video_file: file,
        }));
      } catch (error) {
        toast.error(error.message || "Error uploading video");
        e.target.value = "";
      } finally {
        setIsVideoLoading(false);
      }
    }
  };

  // Deleting the lessons which are currently added to update the course
  const handleDeleteLesson = (title) => {
    setLessons(lessons.filter((lesson) => lesson.title !== title));
  };

  // Function to add new lessons, calling the service function.
  const handleAddNewLessons = async () => {
    try {
      if (lessons.length === 0) {
        toast.error("Please add at least one lesson");
        return;
      }

      const confirmed = await confirmAddingLessons();

      if (confirmed) {
        const lessonsAdded = await addNewLessonsService(courseId, lessons);

        if (lessonsAdded) {
          toast.success("Lessons added successfully!");
          handleUpdateLessonList(lessonsAdded.lessons);
          setLessons([]);
          setIsAddingNewLesson(false);
        }
      }
    } catch (error) {
      toast.error(error.message || "Error adding lessons");
    }
  };

  return (
    <div>
      {/* Listing the lessons which are currently adding */}
      {lessons.length > 0 && (
        <>
          <div className="flex-col">
            {lessons.map((lesson, index) => (
              <div
                className="mb-4 w-full rounded border p-2"
                key={`${lesson.title}-${index}`} // Better key for mapping
              >
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">
                    Lesson {index + 1}
                  </span>
                  <span
                    onClick={() => handleDeleteLesson(lesson.title)}
                    className="cursor-pointer"
                  >
                    <CloseIcon />
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {lesson.lesson_preview && (
                    <div className="col-span-1">
                      <video
                        src={lesson.lesson_preview}
                        controls
                        className="w-full rounded"
                      />
                    </div>
                  )}
                  <div
                    className={`${
                      lesson.lesson_preview ? "col-span-2" : "col-span-3"
                    }`}
                  >
                    <h3 className="mb-2 text-lg font-semibold">
                      {lesson.title}
                    </h3>
                    <p className="text-sm">{lesson.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div onClick={handleAddNewLessons} className="mb-5 flex justify-end">
            <Button text="Submit" />
          </div>
        </>
      )}

      {/* Form for adding lessons */}
      <div className="mb-6 flex flex-col items-end gap-4">
        <div className="w-full">
          <label className="text-blue-gray-800 mb-2 text-sm font-medium">
            Lesson Title
          </label>
          <div className="flex gap-4">
            <input
              value={lesson.title}
              onChange={handleLessonInputChange}
              name="title"
              type="text"
              placeholder="Python - Basics to advanced..."
              className="border-t-blue-gray-200 w-full rounded border p-3 text-sm placeholder-opacity-100 focus:border-theme-primary focus:outline-none"
            />
            <span onClick={handleAddLesson} className="cursor-pointer">
              <Button bg={false} text="Add Lesson" />
            </span>
          </div>
        </div>
      </div>

      <div className="mb-6 flex flex-col items-end gap-4 md:flex-row">
        <div className="w-full md:w-4/6">
          <label className="text-blue-gray-800 mb-2 text-sm font-medium">
            Content
          </label>
          <textarea
            value={lesson.content}
            onChange={handleLessonInputChange}
            name="content"
            placeholder="Enter your lesson content here..."
            className="border-t-blue-gray-200 h-48 w-full resize-none rounded-lg border p-3 focus:border-theme-primary focus:outline-none"
          />
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
                onClick={() => {
                  setVideoPreview("");
                  setLesson((prev) => ({
                    ...prev,
                    lesson_preview: "",
                    video_file: null,
                  }));
                }}
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
    </div>
  );
};

export default AddLessonForm;
