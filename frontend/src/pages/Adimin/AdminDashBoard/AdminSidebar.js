import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Styles imported from common module for hovering effect of icons.
import { styles } from "../../../components/common";
import {
  BookIcon,
  CategoryIcon,
  CoursesIcon,
  DashboardIcon,
  DropDownArrow,
  HamBurger,
  UsersIcon,
} from "../../../components/common/Icons";

const AdminSidebar = () => {
  // State to track which menu item is selected
  const [selected, setSelected] = useState("");

  // State to control sidebar visibility on smaller screens
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // State to track which dropdown (if any) is open
  const [openDropdown, setOpenDropdown] = useState(null);

  const navigate = useNavigate(); // Used for navigation
  const location = useLocation(); // Used to get the current URL path

  // Effect to update the selected menu item and open the appropriate dropdown
  // based on the current URL path
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/admin/dashboard")) setSelected("dashboard");
    else if (path.includes("/admin/coursecategory")) {
      setSelected("course category");
      setOpenDropdown("courses");
    } else if (path.includes("/admin/allcourses")) {
      setSelected("all courses");
      setOpenDropdown("courses");
    } else if (path.includes("/admin/users")) setSelected("users");
  }, [location]);

  // Function to handle clicks on menu items
  const handleClick = (item, dropdown = null, url = null) => {
    setSelected(item); // Set the selected menu item
    if (dropdown) {
      // Toggle the dropdown if applicable
      setOpenDropdown((prev) => (prev === dropdown ? null : dropdown));
    }
    if (url) {
      navigate(url); // Navigate to the specified URL
    }
  };

  // Function to toggle the sidebar's visibility on smaller screens
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {/* Hamburger button for toggling sidebar on small screens */}
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
        <div className="flex flex-1 flex-col overflow-y-auto">
          <nav className="flex-1 px-2 py-4">
            {/* Dashboard menu item */}
            <div
              className={`flex cursor-pointer items-center gap-1 ${styles.iconContainer} rounded border-b border-b-gray-100 px-2 ${
                selected === "dashboard"
                  ? "bg-theme-primary text-white"
                  : "hover:bg-theme-primary hover:text-white"
              }`}
              onClick={() => handleClick("dashboard", null, "/admin/dashboard")}
            >
              <DashboardIcon isSelected={selected === "dashboard"} />
              <a className="flex items-start px-3 py-2">Dashboard</a>
            </div>

            {/* Courses menu item with dropdown */}
            <div
              className={`flex cursor-pointer items-center gap-1 ${styles.iconContainer} rounded border-b border-b-gray-100 px-2 ${
                selected === "courses" || openDropdown === "courses"
                  ? "bg-theme-primary text-white"
                  : "hover:bg-theme-primary hover:text-white"
              }`}
              onClick={() => handleClick("courses", "courses")}
            >
              <CoursesIcon
                isSelected={
                  selected === "courses" || openDropdown === "courses"
                }
              />
              <a className="flex items-start px-3 py-2">Courses</a>
              <span className="ml-auto pr-2">
                <DropDownArrow />
              </span>
            </div>

            {/* Dropdown content for Courses */}
            {openDropdown === "courses" && (
              <article className="w-full rounded bg-gray-50 px-1">
                <ul className="mt-1 flex flex-col pl-2">
                  {/* Course Categories menu item */}
                  <li
                    className={`rounded p-2 hover:bg-gray-200 ${
                      selected === "course category" ? "bg-gray-200" : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClick(
                        "course category",
                        null,
                        "/admin/coursecategory",
                      );
                    }}
                  >
                    <a className="flex items-center gap-2">
                      <CategoryIcon gray={selected !== "course category"} />
                      Course Categories
                    </a>
                  </li>
                  {/* All Courses menu item */}
                  <li
                    className={`rounded p-2 hover:bg-gray-200 ${
                      selected === "all courses" ? "bg-gray-200" : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClick("all courses", null, "/admin/allcourses");
                    }}
                  >
                    <a className="flex items-center gap-2">
                      <BookIcon
                        gray={selected !== "all courses"}
                        w={21}
                        h={21}
                      />
                      All Courses
                    </a>
                  </li>
                </ul>
              </article>
            )}

            {/* Users menu item */}
            <div
              className={`flex cursor-pointer items-center gap-1 ${styles.iconContainer} rounded border-b border-b-gray-100 px-2 ${
                selected === "users"
                  ? "bg-theme-primary text-white"
                  : "hover:bg-theme-primary hover:text-white"
              }`}
              onClick={() => handleClick("users", null, "/admin/users")}
            >
              <UsersIcon isSelected={selected === "users"} />
              <a className="flex items-start px-3 py-2">Users</a>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
