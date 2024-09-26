import React, { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import Swal from "sweetalert2";

import {
  updateCreateCourseSuggestion,
  getCourseDetails,
  updateCourseStatus,
  mentorChangingSuggestionStatus,
  getFullLessonData,
} from "../../services/courseServices/courseService";
import { useParams } from "react-router-dom";
import { Button, Loading, ReactStarsWrapper } from "../common";
import { DropDownArrow, DropUpArrow, PlusIcon } from "../common/Icons";
import { CourseStatusChange, courseStyles } from "./";
import { toast } from "react-toastify";
import { styles } from "../common";
import { getAverageCourseRatingService } from "../../services/courseServices/reviewService";
import { ListReviews } from "../Reviews";

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

const CourseDetail = ({ role }) => {
  const { id } = useParams(); // Course id fetching.
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedLessonIds, setExpandedLessonIds] = useState([]);
  const [isStatusChangeOpen, setIsStatusChangeOpen] = useState(false);
  const [suggestionText, setSuggestionText] = useState("");
  const [suggestion, setSuggestion] = useState({});
  const [suggestionStatus, setSuggestionStatus] = useState(false);
  const [courseRating, setCourseRating] = useState({});

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
      console.log("Fetched rating: ", fetchedRating);
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
          const lessonDetails = await getFullLessonData(lessonId, id);
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
      <div className="relative hidden w-full items-center bg-[#4a4129] p-6 text-white md:flex md:flex-row">
        {/* Free Badge */}
        {course.price.amount === "0.00" && (
          <span className="absolute left-0 top-0 m-4 rounded bg-slate-300 bg-opacity-45 p-2 font-sentinent-medium-italic">
            * Free *
          </span>
        )}

        {/* Left Section: Title and Mentor Info */}
        <div className="ml-4 flex w-full flex-col gap-1 md:w-1/2">
          <h1 className="text-3xl font-bold text-white md:text-4xl">
            {course.title}
          </h1>
          <p className="text-md text-white">{course.mentor_name}</p>
          {courseRating && (
            <div className="flex cursor-pointer items-end gap-2">
              <h4 className="font-sentinent-medium text-lg text-yellow-400">
                <a href="#reviews">{courseRating?.average_rating}</a>
              </h4>
              <a href="#reviews">
                <ReactStarsWrapper
                  edit={false}
                  value={courseRating.average_rating}
                  size={22}
                />
              </a>
              <span className="self-center text-xs text-blue-100">
                <a href="#reviews">
                  ({courseRating.total_reviews ? "ratings" : "No ratings yet"})
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
        </div>
      </div>

      <div className="mx-auto w-4/5 flex-col md:hidden">
        <img
          src={course.preview_image}
          alt={course.title}
          className="h-52 w-full rounded-lg object-cover shadow-lg"
        />
        <h1 className="mt-2 text-2xl font-bold sm:text-3xl">{course.title}</h1>
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
              <h3 className="text-lg font-bold md:text-2xl">Course Status</h3>
              <p
                className={`w-1/2 ${courseStyles[course.status]} mb-2 p-2 text-center text-sm font-bold`}
              >
                {course.status.charAt(0).toUpperCase() + course.status.slice(1)}{" "}
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

      <div className="mx-auto mt-1 bg-white p-6 shadow-md md:mt-4">
        {/* Course description */}
        <div className="mt-1">
          <h2 className="text-lg font-bold md:text-2xl">Description</h2>
          <h5 className="text-gray-700">{course.description}</h5>
        </div>
        {/* Course requirement */}
        <div className="mt-6 md:mt-3">
          <h2 className="text-lg font-bold md:text-2xl">Requirements</h2>
          <h5 className="text-gray-700">{course.requirements.description}</h5>
        </div>
        {/* Lessons */}
        <div className="mt-8">
          <h2 className="mb-5 text-lg font-bold md:text-2xl">Lessons</h2>
          {course.lessons &&
            course.lessons.map((lesson) => (
              <div key={lesson.id} className="">
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
        {/* Reviews and rating */}
        <div id="reviews" className="mb-5 bg-white p-8 shadow-md">
          <h2 className="mb-3 text-lg font-bold md:text-2xl">
            Reviews and rating
          </h2>
          <div className="flex items-center gap-2">
            <ReactStarsWrapper
              size={50}
              value={courseRating.average_rating}
              edit={false}
            />
            <span className="text-sm text-blue-500">
              ({courseRating.total_reviews ? "ratings" : "No ratings yet"})
            </span>
          </div>
          <h2 className="text-xl font-bold text-yellow-700 sm:text-2xl md:text-3xl">
            {courseRating.average_rating} Course Ratings
          </h2>

          <div className="mt-8">
            <ListReviews courseId={id} />
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseDetail;
