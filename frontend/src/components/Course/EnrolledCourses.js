import React, { useEffect, useState } from "react";
import { getEnrolledCourses } from "../../services/courseServices/courseService";

import { useDispatch } from "react-redux";
import { setEnrolledCoursesState } from "../../features/course/enrolledCoursesState";
import { useNavigate } from "react-router-dom";
import { EnrolledCoursesSkeleton } from "../Skeletons";
import { Footer, Header } from "../common";

const EnrolledCourses = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        setIsLoading(true);
        const fetchedEnrolledCourses = await getEnrolledCourses();
        if (fetchedEnrolledCourses) {
          setEnrolledCourses(fetchedEnrolledCourses);
          dispatch(setEnrolledCoursesState(fetchedEnrolledCourses));
        }
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  return (
    <>
      <Header />
      <h1 className="m-6 text-xl font-bold md:text-2xl">Your Courses</h1>
      <div className="mt-3 grid grid-cols-1 gap-3 p-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <EnrolledCoursesSkeleton />
        ) : (
          enrolledCourses.map((item) => (
            <div
              key={item.course.id}
              onClick={() => navigate(`/enrolled-course/${item.course.id}`)}
              className="flex cursor-pointer flex-col items-start rounded border border-gray-300 p-4"
            >
              <img
                src={item.course.preview_image}
                alt={item.course.title}
                className="h-36 w-full rounded bg-gray-300 object-cover md:h-40"
              />
              <div className="mt-2 flex w-full flex-col">
                <h3 className="text-lg font-semibold">{item.course.title}</h3>
                <p className="text-gray-600">{item.course.mentor_name}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <Footer />
    </>
  );
};

export default EnrolledCourses;
