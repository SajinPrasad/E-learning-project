import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getCourseDetails,
  getLessonContent,
} from "../../services/courseServices/courseService";
import { Loading, ReactStarsWrapper } from "../common";
import { DropDownArrow, DropUpArrow } from "../common/Icons";
import { createCartItems } from "../../services/cartServices";
import { addItemToCart } from "../../features/cartItem/cartItemSlice";
import { useDispatch, useSelector } from "react-redux";
import { getAverageCourseRatingService } from "../../services/courseServices/reviewService";
import { ListReviews } from "../Reviews";
import { MentorProfileBox } from "../Profile";
import { CommentsPage } from "../../pages/Comments";

/**
 * Component which renders the course details for students
 */
const StudentCourseDetails = () => {
  const { id } = useParams(); // Course id which is fetched from url
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedLessonIds, setExpandedLessonIds] = useState([]);
  const dispatch = useDispatch();
  const [courseRating, setCourseRating] = useState({});
  const [selectedItem, setSelectedItem] = useState("reviews");
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        const courseDetails = await getCourseDetails(id);
        if (courseDetails) {
          setCourse(courseDetails);
        }
      } catch (error) {
        console.error("Error fetching course details");
      } finally {
        setIsLoading(false); // Make sure loading state is updated
      }
    };

    const fetchCourseRating = async () => {
      const fetchedRating = await getAverageCourseRatingService(id);
      if (fetchedRating) {
        setCourseRating(fetchedRating);
      }
    };

    fetchCourseDetail();
    fetchCourseRating();
  }, [id]);

  const handleAddCartItem = async () => {
    const newItem = await createCartItems(id);
    if (newItem) {
      dispatch(addItemToCart(newItem));
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
          const lessonDetails = await getLessonContent(lessonId, course.id);
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
          console.error("Error fetching lesson details");
        }
      }
    }
  };

  // Handle loading state
  if (isLoading) {
    return <Loading />; // Optional loading component
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
          <p className="text-sm text-white">{course.category_path}</p>
          <h1 className="text-2xl font-bold text-gray-800 md:text-4xl md:text-white">
            {course.title}
          </h1>
          <p className="text-md text-gray-600 md:text-white">
            {course.mentor_name}
          </p>
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
          <span className="font-sentinent-bold text-2xl text-gray-800 sm:text-3xl md:mt-4 md:text-4xl md:text-white">
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

          {isAuthenticated ? (
            <button
              type="submit"
              onClick={handleAddCartItem}
              className="mt-5 h-12 w-full bg-theme-primary text-center font-bold text-white"
            >
              Add to cart
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="mt-5 h-12 w-full bg-theme-primary text-center font-bold text-white"
            >
              Login to purchase course
            </button>
          )}
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
                      className={`flex cursor-pointer items-center ${index === course.lessons.length - 1 ? "" : "border-b-0"} justify-between border border-gray-300 bg-slate-50 p-3 hover:bg-purple-50`}
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

            <div className="flex justify-around font-semibold">
              <h4
                onClick={() => setSelectedItem("reviews")}
                className={`${selectedItem === "reviews" ? "border-b-2 border-gray-700 text-gray-700" : "text-gray-400"} cursor-pointer`}
              >
                Reviews
              </h4>

              <h4
                onClick={() => setSelectedItem("comments")}
                className={`${selectedItem === "comments" ? "border-b-2 border-gray-700 text-gray-700" : "text-gray-400"} cursor-pointer`}
              >
                Comments
              </h4>
            </div>

            {/* Reviews and rating */}
            {selectedItem === "reviews" && (
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
            )}

            {/* Comments */}
            {selectedItem === "comments" && (
              <div className="mb-5 bg-white p-8 shadow-md">
                <h2 className="mb-3 text-lg font-bold md:text-2xl">Comments</h2>
                <div className="mt-8">
                  <CommentsPage courseId={id} />
                </div>
              </div>
            )}
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

              {isAuthenticated ? (
                <button
                  type="submit"
                  className="mt-5 h-12 w-full bg-theme-primary text-center font-bold text-white"
                  onClick={handleAddCartItem}
                >
                  Add to cart
                </button>
              ) : (
                <button
                  type="submit"
                  className="mt-5 h-12 w-full bg-theme-primary text-center font-bold text-white"
                  onClick={() => navigate("/login")}
                >
                  Login to purchase course
                </button>
              )}
            </div>

            {/* Mentor profile details */}
            <MentorProfileBox profile={course.mentor_profile} />
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentCourseDetails;
