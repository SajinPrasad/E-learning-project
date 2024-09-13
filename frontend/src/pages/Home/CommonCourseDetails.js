import React from "react";

import { StudentCourseDetails } from "../../components/Course";
import { Header } from "../../components/common";

/**
 * Common course details for students and visitors.
 * @returns Component for course details.
 */
const CommonCourseDetails = () => {
  return (
    <>
      <Header />
      <StudentCourseDetails />
    </>
  );
};

export default CommonCourseDetails;
