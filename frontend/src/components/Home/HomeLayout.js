import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { ContentHeading } from "../../components/common";
import {
  getActiveCourses,
  getCoursesForAuthenticatedUser,
  getEnrolledCourses,
} from "../../services/courseServices/courseService";
import { CourseCard } from "../../components/Course";
import { setCoursesState } from "../../features/course/courseSlice";
import { setEnrolledCoursesState } from "../../features/course/enrolledCoursesState";
import { CourseCardSkeleton } from "../Skeletons";

const HomeLayout = () => {
  const { isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState(null);
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

  return (
    <>
      {/** Courses */}
      {enrolledCourses && (
        <div className="m-3 mt-3 rounded border border-gray-200 p-3 md:p-8">
          <div
            onClick={() => navigate("/enrolled-courses")}
            className="w-auto cursor-pointer"
          >
            <ContentHeading text={"Your Courses"} />
          </div>

          <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {enrolledCourses.map((item) => (
              <div
                key={item.course.id}
                className="flex cursor-pointer items-start rounded border border-gray-300 p-4"
              >
                <img
                  src={item.course.preview_image}
                  alt={item.course.title}
                  className="mr-2 h-28 w-28 rounded object-cover md:mr-0 md:h-32 md:w-32"
                />
                <div className="mt-2 flex flex-col self-center md:ml-4 md:mt-0">
                  <h3 className="text-lg font-semibold">{item.course.title}</h3>
                  <p className="text-gray-600">{item.course.mentor_name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="m-3 mt-3 rounded border border-gray-200 p-3 md:p-8">
        <ContentHeading text={"Courses"} />
        <div className="mt-6 grid gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
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
