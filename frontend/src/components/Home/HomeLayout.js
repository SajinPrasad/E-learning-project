import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  Banner,
  ContentHeading,
  Footer,
  Header,
} from "../../components/common";
import {
  getActiveCourses,
  getCoursesForAuthenticatedUser,
  getEnrolledCourses,
  getPopularCourses,
} from "../../services/courseServices/courseService";
import { CourseCard } from "../../components/Course";
import { CourseCardSkeleton } from "../Skeletons";
import { LeftIcon, RightIcon } from "../common/Icons";
import { styles } from "../../components/common";

const HomeLayout = () => {
  const { isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [popularCourses, setPopularCourses] = useState([]);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = useRef(null);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [noMoreCoursesLeft, setNoMoreCoursesLeft] = useState(false);

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
          const fetchedCourses = await getCoursesForAuthenticatedUser(
            setIsLoading,
            page,
          );
          if (fetchedCourses) {
            setCourses(fetchedCourses);
          }
          const fetchedEnrolledCourses = await getEnrolledCourses();
          if (fetchedEnrolledCourses) {
            setEnrolledCourses(fetchedEnrolledCourses);
          }
        } else {
          const fetchedCourses = await getActiveCourses(setIsLoading, page);
          if (fetchedCourses) {
            setCourses(fetchedCourses);
          }
        }
      } catch (error) {
        console.error("Error in useEffect while fetching courses");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchPopularCourses = async () => {
      setIsLoading(true);
      const fetchedPopularCourses = await getPopularCourses();

      if (fetchedPopularCourses) {
        setPopularCourses(fetchedPopularCourses);
      }

      setIsLoading(false);
    };

    fetchPopularCourses();
  }, []);

  const hanldeLoadMoreCourses = async () => {
    setLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);

    const fetchedMoreCourses = await getActiveCourses(setIsLoading, nextPage);
    if (fetchedMoreCourses) {
      // Filter out any courses already in the list to prevent duplicates
      const newUniqueCourses = fetchedMoreCourses.filter(
        (newCourse) => !courses.some((course) => course.id === newCourse.id),
      );
      setCourses([...courses, ...newUniqueCourses]);
    } else {
      setNoMoreCoursesLeft(true);
    }

    setLoadingMore(false);
  };

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

      {isAuthenticated && enrolledCourses.length > 0 && (
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

      {/* Popular Courses */}
      {popularCourses.length > 0 && (
        <div className="m-3 mt-3 rounded border border-gray-200 p-3 md:p-8">
          <span>
            <ContentHeading text={"Popular Courses"} />
          </span>

          <div className="mt-6 grid gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {isLoading
              ? [...Array(5)].map((_, index) => (
                  <CourseCardSkeleton key={index} />
                ))
              : popularCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
          </div>
        </div>
      )}

      {/* Courses */}
      <div className="m-3 mt-3 rounded border border-gray-200 p-3 md:p-8">
        <span className="cursor-pointer" onClick={() => navigate("/courses")}>
          <ContentHeading text={"All Courses"} />
        </span>

        <div className="mt-6 grid gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {isLoading
            ? [...Array(15)].map((_, index) => (
                <CourseCardSkeleton key={index} />
              ))
            : courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {loadingMore &&
            [...Array(5)].map((_, index) => <CourseCardSkeleton key={index} />)}
        </div>

        {!noMoreCoursesLeft && (
          <div className="flex justify-center">
            <button
              onClick={hanldeLoadMoreCourses}
              className="mx-auto mt-3 cursor-pointer rounded-xl border border-gray-500 p-1 text-center text-xs font-semibold text-gray-500"
            >
              Load more
            </button>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default HomeLayout;
