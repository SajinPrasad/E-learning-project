import React from "react";

import { CourseDetail } from "../../../components/Course";
import { useSelector } from "react-redux";
import { MentorLayout } from "../../../components/Mentor";

const MentorCourseDetail = () => {
  const role = useSelector((state) => state.user.role);
  return (
    <MentorLayout>
      <CourseDetail role={role} />
    </MentorLayout>
  );
};

export default MentorCourseDetail;
