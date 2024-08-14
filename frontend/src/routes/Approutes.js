import React from "react";
import { Route, Routes } from "react-router-dom";

import { OTPVerificationForm } from "../components/Auth/Register";
import Home from "../pages/Home/Home";
import {
  MentorLogin,
  MentorRegister,
  StudentLogin,
  StudentRegister,
} from "../pages/Auth";
import { MentorDashBoard } from "../pages/Mentor";
import ProtectedRoutes from "./ProtectedRoutes";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/register" element={<StudentRegister />} />
      <Route path="/login" element={<StudentLogin />} />
      <Route path="/mentor-register" element={<MentorRegister />} />
      <Route path="/mentor-login" element={<MentorLogin />} />
      <Route path="/verification" element={<OTPVerificationForm />} />
      <Route path="/" element={<Home />} />
      <Route element={<ProtectedRoutes />}>
        <Route path="/mentor" element={<MentorDashBoard />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
