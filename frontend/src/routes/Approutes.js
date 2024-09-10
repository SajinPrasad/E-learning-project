import React from "react";
import { Route, Routes } from "react-router-dom";

import { OTPVerificationForm } from "../components/Auth/Register";
import {
  AdminLogin,
  MentorLogin,
  MentorRegister,
  StudentLogin,
  StudentRegister,
} from "../pages/Auth";
import {
  MenotrCourses,
  MentorCourseDetail,
  MentorDashBoard,
} from "../pages/Mentor";
import {
  AdminCourseDetail,
  AdminCourses,
  AdminDashBoard,
} from "../pages/Adimin";
import ProtectedRoutes from "./ProtectedRoutes";
import { CourseCategories } from "../components/Course";
import { CommonCourseDetails, Home } from "../pages/Home";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/register" element={<StudentRegister />} />
      <Route path="/login" element={<StudentLogin />} />
      <Route path="/mentor-register" element={<MentorRegister />} />
      <Route path="/mentor-login" element={<MentorLogin />} />
      <Route path="/verification" element={<OTPVerificationForm />} />
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/course/:id" element={<CommonCourseDetails />} />
      <Route element={<ProtectedRoutes />}>
        <Route path="/mentor" element={<MentorDashBoard />} />
        <Route path="/mentor/courses" element={<MenotrCourses />} />
        <Route path="/mentor/course/:id" element={<MentorCourseDetail />} />
        <Route path="/admin/dashboard" element={<AdminDashBoard />} />
        <Route path="/admin/coursecategories" element={<CourseCategories />} />
        <Route path="/admin/courses" element={<AdminCourses />} />
        <Route path="/admin/course/:id" element={<AdminCourseDetail />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
