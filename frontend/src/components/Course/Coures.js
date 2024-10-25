import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

import { ContentHeading, Header } from "../common";
import { CourseCardSkeleton } from "../Skeletons";
import CourseCard from "./CourseCard";
import {
  filterCourseWithCategoryService,
  getActiveCourses,
  getCoursesForAuthenticatedUser,
  searchCourseService,
} from "../../services/courseServices/courseService";
import { setCoursesState } from "../../features/course/courseSlice";

const Courses = () => {
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useSelector((state) => state.user);
  const category = searchParams.get("category");
  const queryParams = searchParams.get("q");
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const dispatch = useDispatch();

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
        </div>
      </div>
    </>
  );
};

export default Courses;
