import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  getCourseDetails,
  getLessonContent,
} from "../../services/courseServices/courseService";
import { Loading } from "../common";
import { DropDownArrow, DropUpArrow } from "../common/Icons";

const StudentCourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedLessonIds, setExpandedLessonIds] = useState([]);

  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        const courseDetails = await getCourseDetails(id);
        setCourse(courseDetails);
      } catch (error) {
        console.error("Error fetching course details:", error);
      } finally {
        setIsLoading(false); // Make sure loading state is updated
      }
    };
    fetchCourseDetail();
  }, [id]);

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
          const lessonDetails = await getLessonContent(lessonId, course.id);
          console.log("Lesson data: ", lessonDetails);
          setCourse((prevCourse) => ({
            ...prevCourse,
            lessons: prevCourse.lessons.map((lesson) =>
              lesson.id === lessonId
                ? {
                    ...lesson,
                    content: lessonDetails.trimmed_content,
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
      <div className="relative w-full items-center border border-b-gray-300 bg-white p-6 text-white md:mb-3 md:flex md:flex-row md:bg-[#4f483f] md:text-white">
        {/* Preview Image for Small Screens */}
        <div className="relative mb-4 w-full md:hidden">
          <img
            src={course.preview_image}
            alt={course.title}
            className="h-56 w-full rounded-lg object-cover shadow-lg"
          />
        </div>

        {/* Free Badge */}
        {course.price.amount === "0.00" && (
          <span className="absolute left-0 top-0 m-4 rounded bg-slate-300 bg-opacity-45 p-2 font-sentinent-medium-italic">
            * Free *
          </span>
        )}

        {/* Left Section: Title and Mentor Info */}
        <div className="flex w-full flex-col gap-1 md:ml-14 md:w-2/3">
          <h1 className="text-2xl font-bold text-gray-800 md:text-4xl md:text-white">
            {course.title}
          </h1>
          <p className="text-md text-gray-600 md:text-white">
            {course.mentor_name}
          </p>
          <span className="font-sentinent-bold text-xl text-gray-800 md:mt-4 md:text-2xl md:text-white">
            ₹ {course.price.amount}
          </span>
        </div>

        {/* Right Section: Preview Image for Larger Screens */}
        <div className="relative hidden w-1/3 md:mr-14 md:mt-0 md:block md:w-2/5">
          <img
            src={course.preview_image}
            alt={course.title}
            className="h-56 w-full rounded-lg object-cover shadow-lg"
          />
        </div>
      </div>

      {/* Right side: Fixed Add to Cart Box Mobile view */}
      <div className="bock sticky col-span-1 m-6 mx-auto flex w-5/6 flex-col border border-gray-100 md:mr-4 md:mt-2 md:hidden">
        {/* Add to Cart Box */}
        <div className="bg-white p-6 shadow-md">
          {/* Price Only */}
          <div className="text-center text-2xl font-bold text-gray-900 md:text-3xl">
            <span className="text-xl md:text-2xl">₹</span> {course.price.amount}
          </div>
          <button
            type="submit"
            className="mt-5 h-12 w-full bg-theme-primary text-center font-bold text-white"
          >
            Add to cart
          </button>
        </div>
      </div>

      {/* Course grid layout */}
      <div className="md:mx-12">
        <div className="mx-auto mt-3 grid w-4/5 grid-cols-1 gap-6 md:w-full md:grid-cols-3">
          {/* Left side: Course details with expanded space */}
          <div className="col-span-2 flex flex-col gap-6">
            {/* Description */}
            <div className="bg-white p-8 shadow-md">
              <h2 className="mb-3 text-lg font-bold md:text-2xl">
                What are you going to learn!
              </h2>
              <h5 className="text-gray-700">{course.description}</h5>
            </div>

            {/* Lessons */}
            <div className="bg-white p-8 shadow-md">
              <h2 className="mb-3 text-lg font-bold md:text-2xl">Lessons</h2>
              {course.lessons &&
                course.lessons.map((lesson, index) => (
                  <div key={lesson.id}>
                    <div
                      onClick={() => handleLessonToggle(lesson.id)}
                      className={`flex cursor-pointer items-center ${index == course.lessons.length - 1 ? "" : "border-b-0"} justify-between border border-gray-300 bg-slate-50 p-3 hover:bg-purple-50`}
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
                      </div>
                    )}
                  </div>
                ))}
            </div>

            {/* Requirements */}
            <div className="bg-white p-8 shadow-md">
              <h2 className="mb-3 text-lg font-bold md:text-2xl">
                Requirements
              </h2>
              <h5 className="text-gray-700">
                {course.requirements.description}
              </h5>
            </div>
          </div>

          {/* Right side: Fixed Add to Cart Box */}
          <div className="sticky col-span-1 hidden flex-col md:mr-4 md:mt-2 md:block">
            {/* Add to Cart Box */}
            <div className="bg-white p-6 shadow-lg">
              {/* Price Only */}
              <div className="text-center text-2xl font-bold text-gray-900 md:text-3xl">
                <span className="text-xl md:text-2xl">₹</span>{" "}
                {course.price.amount}
              </div>
              <button
                type="submit"
                className="mt-5 h-12 w-full bg-theme-primary text-center font-bold text-white"
              >
                Add to cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentCourseDetails;
