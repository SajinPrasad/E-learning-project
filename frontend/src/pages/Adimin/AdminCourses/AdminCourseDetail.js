import React from "react";

import { CourseDetail } from "../../../components/Course";
import { useSelector } from "react-redux";
import { AdminLayout } from "../../../components/Admin";

const AdminCourseDetail = () => {
  const role = useSelector((state) => state.user.role);
  
  return (
    <AdminLayout>
      <CourseDetail role={role} />
    </AdminLayout>
  );
};

export default AdminCourseDetail;
