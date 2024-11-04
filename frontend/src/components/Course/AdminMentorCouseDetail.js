import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

import {
  updateCreateCourseSuggestion,
  getCourseDetails,
  getLessonContent,
  updateCourseStatus,
  mentorChangingSuggestionStatus,
} from "../../services/courseServices/courseService";
import { useParams } from "react-router-dom";
import { Button, Loading } from "../common";
import { DropDownArrow, DropUpArrow, PlusIcon } from "../common/Icons";
import { CourseStatusChange, courseStyles } from "./";
import { toast } from "react-toastify";
import { styles } from "../common";

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

const AdminMentorCouseDetail = ({ role }) => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedLessonIds, setExpandedLessonIds] = useState([]);
  const [isStatusChangeOpen, setIsStatusChangeOpen] = useState(false);
  const [suggestionText, setSuggestionText] = useState("");
  const [suggestion, setSuggestion] = useState({});
  const [suggestionStatus, setSuggestionStatus] = useState(false);

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
        setIsLoading(false);
      }
    };

    const updatingCourseSuggestionstatus = async () => {
      const updatedSuggestion = {
        ...suggestion,
        is_done: suggestionStatus,
      };

      try {
        await mentorChangingSuggestionStatus(updatedSuggestion);
      } catch (error) {
        console.log("Error while updating the suggestion status: ");
      }
    };
    
    fetchCourseDetail();

    if (suggestion) {
      updatingCourseSuggestionstatus();
    }
  }, [id, suggestionStatus]);

  // Function to handle opening the status change window
  const handleOpenStatusChange = () => {
    setIsStatusChangeOpen(true);
  };

  // Function to handle closing the status change window
  const handleCloseStatusChange = () => {
    setIsStatusChangeOpen(false);
  };

  // Function to handle status change and API call
  const handleStatusChange = async (newStatus) => {
    let submit;

    // Checking whether the current status and updated status are the same.
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

    // Always close the modal after handling the status change
    handleCloseStatusChange();
  };

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
    setSuggestionStatus((prev) => !prev);
  };

  const handleLessonToggle = async (lessonId) => {
    // Check if the lesson is already expanded and has content
    const lesson = course.lessons.find((lesson) => lesson.id === lessonId);

    if (expandedLessonIds.includes(lessonId)) {
      // Collapse the lesson
      setExpandedLessonIds(expandedLessonIds.filter((id) => id !== lessonId));
    } else {
      // If lesson content is already fetched, just expand it
      if (lesson && lesson.content) {
        setExpandedLessonIds([...expandedLessonIds, lessonId]);
      } else {
        // Fetch the lesson content if not already fetched
        try {
          const lessonDetails = await getLessonContent(lessonId);
          setCourse((prevCourse) => ({
            ...prevCourse,
            lessons: prevCourse.lessons.map((lesson) =>
              lesson.id === lessonId
                ? {
                    ...lesson,
                    content: lessonDetails.content,
                    video_file: lessonDetails.video_file,
                  }
                : lesson,
            ),
          }));
          setExpandedLessonIds([...expandedLessonIds, lessonId]);
        } catch (error) {
          console.error("Error fetching lesson details:", error);
        }
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
      {/* Title section */}
      <div className="relative hidden w-full items-center bg-[#2e2a37] p-6 text-white md:flex md:flex-row">
        {/* Free Badge */}
        {course.price.amount === "0.00" && (
          <span className="absolute left-0 top-0 m-4 rounded bg-slate-300 bg-opacity-45 p-2 font-sentinent-medium-italic">
            * Free *
          </span>
        )}

        {/* Left Section: Title and Mentor Info */}
        <div className="ml-4 flex w-full flex-col gap-1 md:w-2/3">
          {" "}
          {/* Expanded width */}
          <h1 className="text-3xl font-bold text-white md:text-4xl">
            {course.title}
          </h1>
          <p className="text-md text-white">{course.mentor_name}</p>
          <span className="mt-4 font-sentinent-bold text-2xl text-white">
            ₹ {course.price.amount}
          </span>
        </div>

        {/* Right Section: Preview Image */}
        <div className="relative mt-4 w-1/3 md:mt-0 md:w-1/3">
          {" "}
          {/* Reduced width */}
          <img
            src={course.preview_image}
            alt={course.title}
            className="h-56 w-full rounded-lg object-cover shadow-lg"
          />
        </div>
      </div>

      {/* Course grid layout */}
      <div className="mx-auto mt-3 grid w-4/5 grid-cols-1 gap-6 md:w-full md:grid-cols-3">
        {/* Left side: Course details with expanded space */}
        <div className="col-span-2 flex flex-col gap-4">
          {/* Course status */}
          <div className="flex flex-col md:flex-row md:items-center md:border-r md:border-gray-200">
            <div className="mt-4 px-6 md:w-1/2">
              <h3 className="text-lg font-bold md:text-2xl">Course Status</h3>
              <p
                className={`mb-2 p-2 text-center text-sm font-bold ${courseStyles[course.status]}`}
              >
                {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
              </p>
            </div>

            {role === "admin" && (
              <div
                onClick={handleOpenStatusChange}
                className="mt-3 px-6 md:ml-4 md:mt-9 md:w-auto"
              >
                <Button bg={false} text={"Change course status"} />
                {isStatusChangeOpen && (
                  <CourseStatusChange
                    isOpen={isStatusChangeOpen}
                    onClose={handleCloseStatusChange}
                    onSubmit={handleStatusChange}
                    currentStatus={course.status}
                  />
                )}
              </div>
            )}
          </div>

          {/* Suggestions for Admin */}
          {role === "admin" && (
            <div className="m-2 flex w-full flex-col justify-end px-6 md:justify-start">
              <p className="text-md mt-1 flex max-w-fit cursor-pointer items-center gap-1 font-bold text-gray-500 hover:text-theme-primary md:text-lg">
                Add Suggestion <PlusIcon />
              </p>
              <textarea
                value={suggestionText}
                onChange={(e) => setSuggestionText(e.target.value)}
                className="border-t-blue-gray-200 h-32 w-full resize-none rounded-lg border p-3 focus:border-theme-primary focus:outline-none"
                placeholder="Enter your suggestion here..."
              />
              <div
                onClick={handleUpdateCreateCourseSuggestion}
                className="ml-2 mt-2"
              >
                <Button text={"Submit"} />
              </div>
            </div>
          )}

          {/* Suggestions for Mentor */}
          {role === "mentor" && suggestionText && (
            <div className="m-2 flex w-full flex-col justify-start px-6">
              <div className="flex items-center justify-between">
                <p className="mt-1 max-w-fit cursor-pointer text-lg font-bold text-gray-900">
                  Suggestions
                </p>
                <div className="ml-2 mt-2 md:mt-0">
                  <input
                    type="checkbox"
                    id="choose-me"
                    className="peer hidden"
                    checked={suggestionStatus}
                    onChange={handleSuggestionStatusChange}
                  />
                  <label
                    htmlFor="choose-me"
                    className={`flex cursor-pointer select-none items-center justify-center rounded border-2 px-3 py-2 text-sm font-bold transition-colors duration-200 ease-in-out ${suggestionStatus ? "border-green-900 bg-green-200 text-green-900" : "border-gray-500 text-gray-700"}`}
                  >
                    {suggestionStatus
                      ? "Mark as completed"
                      : "Mark as not completed"}
                  </label>
                </div>
              </div>
              <div className="border-t-blue-gray-200 mt-2 w-full resize-none rounded-lg border p-3">
                {suggestionText}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="bg-white p-6 shadow-md">
            <h2 className="text-lg font-bold md:text-2xl">Description</h2>
            <h5 className="text-gray-700">{course.description}</h5>
          </div>

          {/* Requirements */}
          <div className="bg-white p-6 shadow-md">
            <h2 className="text-lg font-bold md:text-2xl">Requirements</h2>
            <h5 className="text-gray-700">{course.requirements.description}</h5>
          </div>
        </div>

        {/* Right side: Lessons with reduced space */}
        <div className="col-span-1 flex flex-col">
          <h2 className="mb-5 text-lg font-bold md:text-2xl">Lessons</h2>
          {course.lessons &&
            course.lessons.map((lesson) => (
              <div key={lesson.id}>
                <div
                  onClick={() => handleLessonToggle(lesson.id)}
                  className="flex cursor-pointer items-center justify-between border border-gray-300 bg-slate-50 p-3 hover:bg-purple-50"
                >
                  <h2 className="text-md font-semibold text-gray-700 hover:text-blue-950">
                    {lesson.title}
                  </h2>
                  {expandedLessonIds.includes(lesson.id) ? (
                    <DropUpArrow />
                  ) : (
                    <DropDownArrow />
                  )}
                </div>
                {expandedLessonIds.includes(lesson.id) && (
                  <div className="border border-gray-200 bg-white p-3">
                    <p>{lesson.content}</p>
                    {lesson.video_file && (
                      <video
                        controls
                        className="mx-auto h-auto w-full max-w-md rounded border border-gray-300 shadow-md"
                      >
                        <source src={lesson.video_file} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default AdminMentorCouseDetail;
