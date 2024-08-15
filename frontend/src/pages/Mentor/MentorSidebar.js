import React, { useState } from "react";

// Styles imported from icons module for hovering effect for SVGs.
import { styles } from "../../components/common";
import {
  CoursesIcon,
  DashboardIcon,
  HamBurger,
} from "../../components/common/Icons";
import { useNavigate } from "react-router-dom";

const MentorSidebar = () => {
  const [selected, setSelected] = useState("dashboard"); // Tracks the selected sidebar item
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Controls sidebar visibility on smaller screens
  const navigate = useNavigate();

  // Handles sidebar item click, updates selected state, and navigates
  const handleClick = (item) => {
    setSelected(item);
    navigate(`/mentor`);
  };

  // Toggles sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {/* Sidebar toggle button for small screens */}
      <button
        className="fixed left-4 top-4 z-20 rounded-md bg-white p-2 shadow-md lg:hidden"
        onClick={toggleSidebar}
      >
        <HamBurger />
      </button>

      {/* Sidebar container */}
      <div
        className={`fixed inset-y-0 left-0 z-10 flex h-screen w-52 flex-col bg-white text-black shadow-lg transition-transform duration-300 ease-in-out lg:w-full ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:translate-x-0`}
      >
        <div className={`flex flex-1 flex-col overflow-y-auto`}>
          <nav className={`flex-1 px-2 py-4`}>
            {/* Dashboard link */}
            <div
              className={`flex cursor-pointer items-center gap-1 ${styles.iconContainer} rounded border-b border-b-gray-100 px-2 ${
                selected === "dashboard"
                  ? "bg-theme-primary text-white" // Apply styles if selected
                  : "hover:bg-theme-primary hover:text-white"
              }`}
              onClick={() => handleClick("dashboard")}
            >
              <DashboardIcon isSelected={selected === "dashboard"} />
              <a className={`flex items-start px-3 py-2`}>Dashboard</a>
            </div>
            {/* My Courses link */}
            <div
              className={`flex cursor-pointer items-center gap-1 ${styles.iconContainer} rounded border-b border-b-gray-100 px-2 ${
                selected === "courses"
                  ? "bg-theme-primary text-white" // Apply styles if selected
                  : "hover:bg-theme-primary hover:text-white"
              }`}
              onClick={() => handleClick("courses")}
            >
              <CoursesIcon isSelected={selected === "courses"} />
              <a className={`flex items-start px-3 py-2`}>My Courses</a>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

export default MentorSidebar;
