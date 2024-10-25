import React, { useEffect, useState } from "react";

import { AdminLayout } from "../../../components/Admin";
import { CourseCard } from "../../../components/Course";
import {
  filterCourseWithCategoryService,
  getCourses,
  searchCourseService,
} from "../../../services/courseServices/courseService";
import { useSelector } from "react-redux";
import { Loading } from "../../../components/common";
import { useSearchParams } from "react-router-dom";

const AdminCourses = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const queryParams = searchParams.get("q");
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
