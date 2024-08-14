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

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/register" Component={StudentRegister} />
      <Route path="/login" Component={StudentLogin} />
      <Route path="/mentor-register" Component={MentorRegister} />
      <Route path="/mentor-login" Component={MentorLogin} />
      <Route path="/verification" Component={OTPVerificationForm} />
      <Route path="/" Component={Home} />
      <Route path="/mentor" Component={MentorDashBoard} />
    </Routes>
  );
};

export default AppRoutes;
