import React, { useEffect, useRef, useState } from "react";

import {
  getCourseDetails,
  getFullLessonData,
  updateLessonCompletionStatus,
} from "../../services/courseServices/courseService";
import { useParams } from "react-router-dom";
import { ReviewForm, ListReviews } from "../Reviews";
import CourseOverview from "./CourseOverview";
import { getAverageCourseRatingService } from "../../services/courseServices/reviewService";
import { toast } from "react-toastify";
import { LessonSkeleton, VideoSkeleton } from "../Skeletons";
import { CommentsPage } from "../../pages/Comments";
import { Footer } from "../common";

/**
 * @returns The component which renders the full course view (Including videos).
 * Only accessed by users who purchased the courses
 */
const FullCourseView = () => {
  const { id } = useParams();
  const [courseDetails, setCourseDetails] = useState({});
  const [currentLesson, setCurrentLesson] = useState({});
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0); // Track lesson index
  const [selected, setSelected] = useState("lessons");
  const [showMore, setShowMore] = useState(false); // State to manage "see more"
  const [showArrows, setShowArrows] = useState(true); // State to manage arrow visibility
  const [courseRating, setCourseRating] = useState({});
  const videoRef = useRef(null); // Ref to control video events
  let hideArrowsTimeout; // Timeout for hiding arrows
  const [reviewUpdated, setReviewUpdated] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [isLessonLoading, setIsLessonLoading] = useState(false);

  useEffect(() => {
    const fetchLessonContent = async () => {
      setIsLessonLoading(true);
      setIsVideoLoading(true);
      const response = await getCourseDetails(id);
      if (response) {
        setCourseDetails(response);
        const firstLessonData = await getFullLessonData(
          response.lessons[0].id,
          id,
        );
        setCurrentLesson(firstLessonData);
        setCurrentLessonIndex(0); // Set index to 0 for first lesson
        setIsLessonLoading(false);
        setIsVideoLoading(false);
      }
    };

    const fetchCourseRating = async () => {
      const fetchedRating = await getAverageCourseRatingService(id);
      setCourseRating(fetchedRating);
    };

    fetchLessonContent();
    fetchCourseRating();
  }, [id, reviewUpdated]);

  useEffect(() => {
    if (videoRef.current) {
      // Event listener to update current time continuously
      const timeUpdateHandler = () => {
        if (videoRef.current.currentTime >= videoRef.current.duration - 1) {
          handleNextLesson(); // Navigate to the next lesson automatically
        }
      };

      videoRef.current.addEventListener("timeupdate", timeUpdateHandler);

      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener("timeupdate", timeUpdateHandler);
        }
      };
    }
  }, [currentLessonIndex, currentLesson.id]);

  const handleChangingLessons = async (lessonId, index) => {
    const lessonData = await getFullLessonData(lessonId, id);
    if (lessonData) {
      setCurrentLesson(lessonData);
      setCurrentLessonIndex(index);
    }
  };

  const handleNextLesson = () => {
    if (currentLessonIndex < courseDetails.lessons.length - 1) {
      const nextLesson = courseDetails.lessons[currentLessonIndex + 1];
      handleChangingLessons(nextLesson.id, currentLessonIndex + 1);
    }
  };

  const handlePreviousLesson = () => {
    if (currentLessonIndex > 0) {
      const prevLesson = courseDetails.lessons[currentLessonIndex - 1];
      handleChangingLessons(prevLesson.id, currentLessonIndex - 1);
    }
  };

  // Function to display a limited number of words
  const displayLimitedWords = (text, wordLimit) => {
    const words = text.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "...";
    }
    return text;
  };

  // Hide arrows after 3 seconds of playing video
  const hideArrows = () => {
    hideArrowsTimeout = setTimeout(() => setShowArrows(false), 1000);
  };

  // Reset the hiding arrows timer on mouse movement
  const handleMouseMove = () => {
    setShowArrows(true); // Show the arrows when mouse moves
    clearTimeout(hideArrowsTimeout); // Clear any existing hide timer
    hideArrows(); // Set a new timer to hide after 3 seconds
  };

  // Start hiding arrows when the video starts playing
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener("play", hideArrows);
      videoRef.current.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener("play", hideArrows);
        videoRef.current.removeEventListener("mousemove", handleMouseMove);
      }
      clearTimeout(hideArrowsTimeout); // Clean up the timeout
    };
  }, [currentLessonIndex]);

  return (
    <>
      <div className="w-full">
        {/* Video Container */}
        <div className="relative mb-3 w-full">
          {isVideoLoading || !currentLesson?.video_file ? (
            <VideoSkeleton />
          ) : (
            <video
              controls
              src={currentLesson?.video_file}
              className="h-auto max-h-[75vh] w-full rounded border border-gray-300 shadow-lg"
              ref={videoRef}
            />
          )}

          {/* Previous and Next Arrows */}
          {showArrows && (
            <>
              <button
                onClick={handlePreviousLesson}
                disabled={currentLessonIndex === 0}
                className={`absolute left-2 top-1/2 -translate-y-1/2 transform rounded bg-gray-800 p-3 text-2xl text-white shadow-lg ${
                  currentLessonIndex === 0 && "cursor-not-allowed opacity-50"
                }`}
              >
                &larr; {/* Left Arrow */}
              </button>
              <button
                onClick={handleNextLesson}
                disabled={
                  currentLessonIndex === courseDetails.lessons?.length - 1
                }
                className={`absolute right-2 top-1/2 -translate-y-1/2 transform rounded ${currentLesson.completed ? "bg-gray-800" : "bg-gray-700"} p-3 text-2xl text-white shadow-lg ${
                  (currentLessonIndex === courseDetails.lessons?.length - 1 &&
                    "cursor-not-allowed opacity-50")
                }`}
              >
                &rarr; {/* Right Arrow */}
              </button>
            </>
          )}
        </div>

        {/* About the Lesson */}
        <div className="mb-4 mt-1 p-2 md:mx-auto md:w-2/3">
          <h2 className="text-md mb-2 font-bold md:text-xl">
            About the lesson
          </h2>
          <h5 className="text-gray-700">
            {/* Show limited content initially, expand when "See more" is clicked */}
            {showMore
              ? currentLesson?.content || ""
              : displayLimitedWords(currentLesson?.content || "", 5)}
            {!showMore && currentLesson?.content?.split(" ").length > 5 && (
              <span
                className="cursor-pointer text-xs font-semibold text-blue-400"
                onClick={() => setShowMore(true)}
              >
                {" "}
                See more
              </span>
            )}
            {showMore && (
              <span
                className="cursor-pointer text-xs font-semibold text-blue-400"
                onClick={() => setShowMore(false)}
              >
                {" "}
                See less
              </span>
            )}
          </h5>
        </div>

        {/* Tab Navigation */}
        <div className="mx-5 mb-5 flex justify-evenly border-b-2 border-gray-300 pb-3 font-semibold text-gray-400">
          <h3
            onClick={() => setSelected("overview")}
            className={`cursor-pointer ${selected === "overview" && "text-gray-600"}`}
          >
            Overview
          </h3>

          <h3
            onClick={() => setSelected("comments")}
            className={`cursor-pointer ${selected === "comments" && "text-gray-600"}`}
          >
            Comments
          </h3>

          <h3
            onClick={() => setSelected("reviews")}
            className={`cursor-pointer ${selected === "reviews" && "text-gray-600"}`}
          >
            Reviews
          </h3>

          <h3
            onClick={() => setSelected("lessons")}
            className={`cursor-pointer ${selected === "lessons" && "text-gray-600"}`}
          >
            Lessons
          </h3>
        </div>

        {/* Lessons Container */}
        {selected === "lessons" && (
          <div className="mx-auto mb-10 grid w-full max-w-4xl grid-cols-1 gap-0">
            {isLessonLoading ? (
              <LessonSkeleton />
            ) : (
              courseDetails.lessons?.map((lesson, index) => (
                <div
                  onClick={() => handleChangingLessons(lesson.id, index)}
                  key={lesson.title}
                  className={`flex cursor-pointer items-center justify-between border ${currentLessonIndex === index ? "bg-indigo-200" : "bg-slate-50"} border-gray-300 p-4 hover:bg-purple-50 ${
                    index === courseDetails.lessons.length - 1
                      ? ""
                      : "border-b-0"
                  } shadow-md`}
                >
                  <h1 className="text-md font-semibold text-gray-700 hover:text-blue-950">
                    {lesson.title}
                  </h1>
                </div>
              ))
            )}
          </div>
        )}

        {/* Course Overview */}
        {selected === "overview" && <CourseOverview course={courseDetails} />}

        {/* Course Review */}
        {selected === "reviews" && (
          <>
            <ReviewForm
              reviewUpdated={reviewUpdated}
              size={80}
              courseRating={courseRating}
              setReviewUpdated={setReviewUpdated}
              courseId={courseDetails.id}
            />
            <div className="mx-auto w-2/3">
              <ListReviews courseId={courseDetails.id} />
            </div>
          </>
        )}

        {/* Comments */}
        {selected === "comments" && (
          <>
            <CommentsPage courseId={courseDetails.id} />
          </>
        )}
      </div>

      <Footer />
    </>
  );
};
export default FullCourseView;
