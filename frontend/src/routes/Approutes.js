import React from "react";
import { Route, Routes } from "react-router-dom";

import { OTPVerificationForm } from "../components/Auth/Register";
import {
  AdminLogin,
  MentorLogin,
  MentorRegister,
  ResetPassword,
  StudentLogin,
  StudentRegister,
} from "../pages/Auth";
import {
  MenotrCourses,
  MentorCourseDetail,
  MentorDashBoard,
  MentorInbox,
  MentorReportsPage,
} from "../pages/Mentor";
import {
  AdminCourseDetail,
  AdminCourses,
  AdminDashBoard,
} from "../pages/Adimin";
import ProtectedRoutes from "./ProtectedRoutes";
import { CourseCategories } from "../components/Course";
import {
  CommonCourseDetails,
  EnrolledCoursesPage,
  FullCoursePage,
  Home,
} from "../pages/Home";
import { CartPage, ConfirmOrderPage } from "../pages/Cart";
import { MentorProfilePage, StudentProfilePage } from "../pages/Profile";
import InboxPage from "../pages/Chat/InboxPage";
import { EnrolledCoursesSkeleton } from "../components/Skeletons";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/register" element={<StudentRegister />} />
      <Route path="/login" element={<StudentLogin />} />
      <Route path="/mentor-register" element={<MentorRegister />} />
      <Route path="/mentor-login" element={<MentorLogin />} />
      <Route path="/verification" element={<OTPVerificationForm />} />
      <Route path="/resetpassword" element={<ResetPassword />} />
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/course/:id" element={<CommonCourseDetails />} />
      <Route path="/cart/" element={<CartPage />} />
      <Route path="/skeleton/" element={<EnrolledCoursesSkeleton />} />
      <Route element={<ProtectedRoutes />}>
        <Route path="/mentor" element={<MentorDashBoard />} />
        <Route path="/mentor/courses" element={<MenotrCourses />} />
        <Route path="/mentor/course/:id" element={<MentorCourseDetail />} />
        <Route path="/admin/dashboard" element={<AdminDashBoard />} />
        <Route path="/admin/coursecategories" element={<CourseCategories />} />
        <Route path="/admin/courses" element={<AdminCourses />} />
        <Route path="/admin/course/:id" element={<AdminCourseDetail />} />
        <Route path="/confirm-order" element={<ConfirmOrderPage />} />
        <Route path="/enrolled-courses" element={<EnrolledCoursesPage />} />
        <Route path="/enrolled-course/:id" element={<FullCoursePage />} />
        <Route path="/profile" element={<StudentProfilePage />} />
        <Route path="/mentor/profile" element={<MentorProfilePage />} />
        <Route path="/inbox" element={<InboxPage />} />
        <Route path="/mentor/inbox" element={<MentorInbox />} />
        <Route path="/mentor/reports" element={<MentorReportsPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
