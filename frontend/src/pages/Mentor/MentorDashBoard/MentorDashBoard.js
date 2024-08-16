import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import { Header } from "../../../components/common";
import MentorSidebar from "./MentorSidebar";
import MentorStats from "./MentorStats";
import { useNavigate } from "react-router-dom";

const MentorDashBoard = () => {
  const { role } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    //Redirecting non mentor users
    if (role != "mentor") {
      toast.warning("Your are not authorized to visit this page!");
      if (role === "admin") {
        navigate("/admin");
      } else if (role === "student") {
        navigate("/");
      }
    }
  }, []);
  return (
    <div className="flex h-screen flex-col">
      {/* Header with higher z-index */}
      <div className="sticky top-0 z-10 w-full">
        <Header />
      </div>
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar on the left */}
        <div className="w-1/5 flex-shrink-0">
          <MentorSidebar />
        </div>
        {/* Stats on the right */}
        <div className="flex-1 overflow-auto p-4">
          <MentorStats />
        </div>
      </div>
    </div>
  );
};

export default MentorDashBoard;
