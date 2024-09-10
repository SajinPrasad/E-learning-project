import React, { useEffect, useState } from "react";
import {
  Banner,
  ContentHeading,
  Header,
  Loading,
} from "../../components/common";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getActiveCourses } from "../../services/courseServices/courseService";
import { CourseCard } from "../../components/Course";

/**
 * Renders the home page.
 */
const Home = () => {
  const { isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const fetchedCourses = await getActiveCourses(setIsLoading);
        if (fetchedCourses) {
          setCourses(fetchedCourses);
        }
      } catch (error) {
        console.error("Error in useEffect while fetching courses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Header />
      <Banner />
      {/** Courses */}
      <div className="mt-3 rounded border border-gray-200 p-3 m-3 md:p-8">
        <ContentHeading text={"Courses"} />
        <div className="mt-6 grid gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
