import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { AdminLayout, AdminStats } from "../../../components/Admin";

const AdminDashBoard = () => {
  const { role } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    //Redirecting non admin users
    if (role != "admin") {
      toast.warning("Your are not authorized to visit this page!");
      if (role === "mentor") {
        navigate("/mentor");
      } else if (role === "student") {
        navigate("/");
      }
    }
  }, []);
  return (
    <AdminLayout>
      <AdminStats />
    </AdminLayout>
  );
};

export default AdminDashBoard;
