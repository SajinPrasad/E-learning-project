import React, { useState, useEffect } from "react";

// Styles imported from icons module for hovering effect for SVGs.
import { styles } from "../../../components/common";
import {
  CoursesIcon,
  DashboardIcon,
  Documents,
  HamBurger,
  InboxIcon,
} from "../../../components/common/Icons";
import { useNavigate, useLocation } from "react-router-dom";

const MentorSidebar = () => {
  const [selected, setSelected] = useState(""); // Default selection
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Controls sidebar visibility on smaller screens
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Set the selected state based on the current URL path
    const path = location.pathname;
    if (path === "/mentor") {
      setSelected("dashboard");
    } else if (path.startsWith("/mentor/course")) {
      setSelected("courses");
    } else if (path.startsWith("/mentor/inbox")) {
      setSelected("inbox");
    } else if (path.startsWith("/mentor/reports")) {
      setSelected("reports");
    }
  }, [location.pathname]);

  // Handles sidebar item click, updates selected state, and navigates
  const handleClick = (item, url) => {
    setSelected(item);
    navigate(url);
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
              className={`flex cursor-pointer items-center gap-1 ${styles.iconContainer} toggleCourseDropdown rounded px-2 ${
                selected === "dashboard"
                  ? "bg-theme-primary text-white" // Apply styles if selected
                  : "hover:bg-purple-100"
              }`}
              onClick={() => handleClick("dashboard", "/mentor")}
            >
              <DashboardIcon isSelected={selected === "dashboard"} />
              <a className={`flex items-start px-3 py-2`}>Dashboard</a>
            </div>

            {/* My Courses link */}
            <div
              className={`flex cursor-pointer items-center gap-1 ${styles.iconContainer} toggleCourseDropdown rounded px-2 ${
                selected === "courses"
                  ? "bg-theme-primary text-white" // Apply styles if selected
                  : "hover:bg-purple-100"
              }`}
              onClick={() => handleClick("courses", "/mentor/courses")}
            >
              <CoursesIcon isSelected={selected === "courses"} />
              <a className={`flex items-start px-3 py-2`}>My Courses</a>
            </div>

            {/* Inbox */}
            <div
              className={`flex cursor-pointer items-center gap-1 ${styles.iconContainer} toggleCourseDropdown rounded px-2 ${
                selected === "inbox"
                  ? "bg-theme-primary text-white" // Apply styles if selected
                  : "hover:bg-purple-100"
              }`}
              onClick={() => handleClick("inbox", "/mentor/inbox")}
            >
              <InboxIcon isSelected={selected === "inbox"} />
              <a className={`flex items-start px-3 py-2`}>Inbox</a>
            </div>

            {/* Reports */}
            <div
              className={`flex cursor-pointer items-center gap-1 ${styles.iconContainer} toggleCourseDropdown rounded px-2 ${
                selected === "reports"
                  ? "bg-theme-primary text-white" // Apply styles if selected
                  : "hover:bg-purple-100"
              }`}
              onClick={() => handleClick("reports", "/mentor/reports")}
            >
              <Documents isSelected={selected === "reports"} />
              <a className={`flex items-start px-3 py-2`}>Reports</a>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

export default MentorSidebar;
