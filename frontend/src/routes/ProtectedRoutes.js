import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = ({ redirectTo = "/", children }) => {
  const { isAuthenticated } = useSelector((state) => state.user);
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} />;
  }
  return children ? children : <Outlet />;
};

export default ProtectedRoutes;
