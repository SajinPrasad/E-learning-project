import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Banner, ContentHeading, Header } from "../../components/common";
import {
  getActiveCourses,
  getCoursesForAuthenticatedUser,
  getEnrolledCourses,
} from "../../services/courseServices/courseService";
import { CourseCard } from "../../components/Course";
import { setCoursesState } from "../../features/course/courseSlice";
import { setEnrolledCoursesState } from "../../features/course/enrolledCoursesState";
import { CourseCardSkeleton } from "../Skeletons";
import { LeftIcon, RightIcon } from "../common/Icons";
import { styles } from "../../components/common";

const HomeLayout = () => {
  const { isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const dispatch = useDispatch();
  const scrollContainerRef = useRef(null);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      checkScroll();
      container.addEventListener("scroll", checkScroll);
      const resizeObserver = new ResizeObserver(checkScroll);
      resizeObserver.observe(container);

      return () => {
        container.removeEventListener("scroll", checkScroll);
        resizeObserver.disconnect();
      };
    }
  }, [enrolledCourses]);

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        if (isAuthenticated) {
          const fetchedCourses =
            await getCoursesForAuthenticatedUser(setIsLoading);
          if (fetchedCourses) {
            setCourses(fetchedCourses);
            dispatch(setCoursesState(fetchedCourses));
          }
          const fetchedEnrolledCourses = await getEnrolledCourses();
          if (fetchedEnrolledCourses) {
            setEnrolledCourses(fetchedEnrolledCourses);
            dispatch(setEnrolledCoursesState(fetchedEnrolledCourses));
          }
        } else {
          const fetchedCourses = await getActiveCourses(setIsLoading);
          if (fetchedCourses) {
            setCourses(fetchedCourses);
            dispatch(setCoursesState(fetchedCourses));
          }
        }
      } catch (error) {
        console.error("Error in useEffect while fetching courses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const cardWidth = 384 + 12; // 24rem (384px) + 0.75rem gap (12px)
      const scrollAmount = cardWidth * 2; // Scroll two cards at a time

      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <Header />
      <Banner />

      {isAuthenticated && enrolledCourses && (
        <div className="m-3 mt-3 rounded border border-gray-200 p-3 md:p-8">
          <div
            onClick={() => navigate("/enrolled-courses")}
            className="w-auto cursor-pointer"
          >
            <ContentHeading text={"Your Courses"} />
          </div>

          <div className="relative mt-3 flex items-center">
            {canScrollLeft && (
              <button
                onClick={() => scroll("left")}
                className={`${styles.scrollButton} ${styles.scrollButtonLeft}`}
              >
                <LeftIcon />
              </button>
            )}

            <div
              ref={scrollContainerRef}
              className={`flex w-full gap-3 overflow-x-auto ${styles.scrollContainer}`}
            >
              {enrolledCourses.map((item) => (
                <div
                  onClick={() => navigate(`/enrolled-course/${item.course.id}`)}
                  key={item.course.id}
                  className={`flex min-w-[24rem] max-w-[28rem] cursor-pointer items-start rounded border border-gray-300 p-4 ${styles.scrollItem}`}
                >
                  <img
                    src={item.course.preview_image}
                    alt={item.course.title}
                    className="mr-2 h-28 w-28 rounded object-cover"
                  />
                  <div className="ml-4 mt-2 flex flex-col self-center">
                    <h3 className="text-lg font-semibold">
                      {item.course.title}
                    </h3>
                    <p className="text-gray-600">{item.course.mentor_name}</p>
                  </div>
                </div>
              ))}
            </div>

            {canScrollRight && (
              <button
                onClick={() => scroll("right")}
                className={`${styles.scrollButton} ${styles.scrollButtonRight}`}
              >
                <RightIcon />
              </button>
            )}
          </div>
        </div>
      )}

      <div className="m-3 mt-3 rounded border border-gray-200 p-3 md:p-8">
        <span className="cursor-pointer" onClick={() => navigate("/courses")}>
          <ContentHeading text={"Courses"} />
        </span>

        <div className="mt-6 grid gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {isLoading
            ? [...Array(5)].map((_, index) => (
                <CourseCardSkeleton key={index} />
              ))
            : courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
        </div>
      </div>
    </>
  );
};

export default HomeLayout;
