import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { PlusIcon } from "../../../components/common/Icons";
import CourseForm from "../../../components/Course/CourseForm";
import { getCourses } from "../../../services/courseServices/courseService";
import { CourseCard } from "../../../components/Course";
import { MentorLayout } from "../../../components/Mentor";

const MentorCourses = () => {
  const [addCourse, setAddCourse] = useState(false);
  const [courses, setCourses] = useState([]);
  const email = useSelector((state) => state.user.email);

  useEffect(() => {
    const fetchCourses = async () => {
      const fetchedCourses = await getCourses(email);
      if (fetchedCourses) {
        setCourses(fetchedCourses);
      }
    };

    fetchCourses();
  }, []);

  // Refreshing the courses to fetch the newly added couse too.
  const refreshCourses = async () => {
    const fetchedCourses = await getCourses(email);
    if (fetchedCourses) {
      setCourses(fetchedCourses);
    }
  };

  const toggleAddCourse = () => {
    setAddCourse((prevState) => !prevState);
  };

  return (
    <MentorLayout>
      <div className="ml-2 flex-1 justify-center overflow-auto md:ml-0">
        <div className="m-4">
          <h5 className="text-blue-gray-900 text-xl font-semibold sm:text-2xl">
            Course Categories
          </h5>
          <p className="mt-1 text-xs font-normal text-gray-600 md:text-sm">
            Click view more to see the subcategories.
          </p>
          {/* Toggle the form visibility */}
          <p
            onClick={toggleAddCourse}
            className="mt-1 flex max-w-fit cursor-pointer items-center gap-1 text-xs font-bold text-gray-500 hover:text-theme-primary md:text-sm"
          >
            {addCourse ? "Hide Form" : "Add new Course"}
            {!addCourse && (
              <span>
                <PlusIcon />
              </span>
            )}
          </p>
          {/* Render the form conditionally */}
          {addCourse && (
            <CourseForm
              setAddCourse={setAddCourse}
              refreshCourses={refreshCourses}
            />
          )}

          {/* Render course cards */}
          <div className="mt-6 grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </div>
    </MentorLayout>
  );
};

export default MentorCourses;
