import React from "react";
import { Route, Routes } from "react-router-dom";

import { OTPVerificationForm } from "../components/Auth/Register";
import Home from "../pages/Home/Home";
import {
  AdminLogin,
  MentorLogin,
  MentorRegister,
  StudentLogin,
  StudentRegister,
} from "../pages/Auth";
import { MenotrCourses, MentorDashBoard } from "../pages/Mentor";
import {
  AdminDashBoard,
} from "../pages/Adimin";
import ProtectedRoutes from "./ProtectedRoutes";
import { CourseCategories } from "../components/Course";

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
      <Route element={<ProtectedRoutes />}>
        <Route path="/mentor" element={<MentorDashBoard />} />
        <Route path="/mentor/courses" element={<MenotrCourses />} />
        <Route path="/admin/dashboard" element={<AdminDashBoard />} />
        <Route path="/admin/coursecategories" element={<CourseCategories />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
