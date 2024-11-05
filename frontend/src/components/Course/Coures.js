import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

import { ContentHeading, Footer, Header } from "../common";
import { CourseCardSkeleton } from "../Skeletons";
import CourseCard from "./CourseCard";
import {
  filterCourseWithCategoryService,
  getActiveCourses,
  getCoursesForAuthenticatedUser,
  searchCourseService,
} from "../../services/courseServices/courseService";

const Courses = () => {
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useSelector((state) => state.user);
  const category = searchParams.get("category");
  const queryParams = searchParams.get("q");
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [noMoreCoursesLeft, setNoMoreCoursesLeft] = useState(false);

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

    const fetchCoursesWithCategoryFilter = async () => {
      setIsLoading(true);
      const fetchedCoursesWithCategory =
        await filterCourseWithCategoryService(category);
      setCourses(fetchedCoursesWithCategory);
      setIsLoading(false);
    };

    const fetchSearchingCourses = async () => {
      setIsLoading(true);
      const fetchedSearchingCourses = await searchCourseService(queryParams);
      setCourses(fetchedSearchingCourses);
      setIsLoading(false);
    };

    if (category) {
      fetchCoursesWithCategoryFilter();
    } else if (queryParams) {
      fetchSearchingCourses();
    } else {
      fetchCourses();
    }
  }, [category, queryParams]);

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

  return (
    <>
      <Header />
      <div>
        <div className="m-3 mt-3 rounded border border-gray-200 p-3 md:p-8">
          <ContentHeading text={"Courses"} />
          <div className="mt-6 grid gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {isLoading
              ? [...Array(10)].map((_, index) => (
                  <CourseCardSkeleton key={index} />
                ))
              : Array.isArray(courses)
                ? courses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))
                : null}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {loadingMore &&
              [...Array(5)].map((_, index) => (
                <CourseCardSkeleton key={index} />
              ))}
          </div>

          {!noMoreCoursesLeft && !category && !queryParams && (
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
      </div>

      <Footer />
    </>
  );
};

export default Courses;
