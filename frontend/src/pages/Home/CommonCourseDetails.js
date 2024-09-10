import React from "react";

import { CourseDetail } from "../../components/Course";
import { Header } from "../../components/common";

/**
 * Common course details for students and visitors.
 * @returns Component for course details.
 */
const CommonCourseDetails = () => {
  return (
    <>
      <Header />
      <CourseDetail />
    </>
  );
};

export default CommonCourseDetails;
