import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { PlusIcon } from "../../../components/common/Icons";
import CourseForm from "../../../components/Course/CourseForm";
import { getCourses } from "../../../services/courseServices/courseService";
import { CourseCard } from "../../../components/Course";
import { MentorLayout } from "../../../components/Mentor";
import { Loading } from "../../../components/common";
import { useNavigate } from "react-router-dom";

const MentorCourses = () => {
  const [addCourse, setAddCourse] = useState(false);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const role = useSelector((state) => state.user.role);
  const navigate = useNavigate();

  useEffect(() => {
    if (role != "mentor") {
      navigate("/mentor-login");
    }
    const fetchCourses = async () => {
      setIsLoading(true);
      const fetchedCourses = await getCourses(setIsLoading);
      if (fetchedCourses) {
        setCourses(fetchedCourses);
      }
      setIsLoading(false);
    };

    fetchCourses();
  }, []);

  // Refreshing the courses to fetch the newly added couse too.
  const refreshCourses = async () => {
    setIsLoading(true);
    const fetchedCourses = await getCourses(setIsLoading);
    if (fetchedCourses) {
      setCourses(fetchedCourses);
    }
    setIsLoading(false);
  };

  const pendingCourses = courses.filter(
    (course) => course.status === "pending",
  );

  const approvedCourses = courses.filter(
    (course) => course.status === "approved",
  );

  const toggleAddCourse = () => {
    setAddCourse((prevState) => !prevState);
  };

  return (
    <MentorLayout>
      {isLoading && <Loading />}
      <div className="ml-1 flex-1 justify-center overflow-auto md:ml-0">
        <div className="m-2">
          <h5 className="text-blue-gray-900 text-xl font-semibold sm:text-2xl">
            Your Courses
          </h5>
          <p className="mt-1 text-xs font-normal text-gray-600 md:text-sm">
            Add new courses below
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

          {/* Pending Courses */}
          <div className="mt-3 rounded border border-gray-200 p-3">
            <h5 className="text-blue-gray-900 text-md font-semibold sm:text-lg">
              Pending Approval
            </h5>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {pendingCourses.map((course) => (
                <CourseCard key={course.id} course={course} role={role} />
              ))}
            </div>
          </div>

          {/* Active Courses */}
          <div className="mt-3 rounded border border-gray-200 p-3">
            <h5 className="text-blue-gray-900 text-md font-semibold sm:text-lg">
              Active Courses
            </h5>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {approvedCourses.map((course) => (
                <CourseCard key={course.id} course={course} role={role} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </MentorLayout>
  );
};

export default MentorCourses;
