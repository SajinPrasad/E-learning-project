import React, { useEffect, useState } from "react";

import { AdminLayout } from "../../../components/Admin";
import { CourseCard } from "../../../components/Course";
import { getCourses } from "../../../services/courseServices/courseService";
import { useSelector } from "react-redux";
import { Loading } from "../../../components/common";

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const role = useSelector((state) => state.user.role);

  useEffect(() => {
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

  const pendingCourses = courses.filter(
    (course) => course.status === "pending",
  );

  const approvedCourses = courses.filter(
    (course) => course.status === "approved",
  );
  return (
    <AdminLayout>
      {isLoading && <Loading />}
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
    </AdminLayout>
  );
};

export default AdminCourses;