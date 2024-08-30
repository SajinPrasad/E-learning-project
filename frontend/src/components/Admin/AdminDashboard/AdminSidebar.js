import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Styles imported from common module for hovering effect of icons.
import { styles } from "../../../components/common";
import {
  CategoryIcon,
  DashboardIcon,
  HamBurger,
  UsersIcon,
} from "../../../components/common/Icons";

const AdminSidebar = () => {
  // State to track which menu item is selected
  const [selected, setSelected] = useState("");

  // State to control sidebar visibility on smaller screens
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navigate = useNavigate(); // Used for navigation
  const location = useLocation(); // Used to get the current URL path

  // Effect to update the selected menu item based on the current URL path
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/admin/dashboard")) setSelected("dashboard");
    else if (path.includes("/admin/coursecategories"))
      setSelected("course category");
    else if (path.includes("/admin/users")) setSelected("users");
  }, [location]);

  // Function to handle clicks on menu items
  const handleClick = (item, url = null) => {
    setSelected(item); // Set the selected menu item
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
              className={`flex cursor-pointer items-center gap-1 ${styles.iconContainer} rounded px-2 ${
                selected === "dashboard"
                  ? "bg-theme-primary text-white"
                  : "hover:bg-purple-100"
              }`}
              onClick={() => handleClick("dashboard", "/admin/dashboard")}
            >
              <DashboardIcon isSelected={selected === "dashboard"} />
              <a className="flex items-start px-3 py-2">Dashboard</a>
            </div>

            {/* Course Categories menu item */}
            <div
              className={`flex cursor-pointer items-center gap-1 ${styles.iconContainer} rounded px-2 ${
                selected === "course category"
                  ? "bg-theme-primary text-white"
                  : "hover:bg-purple-100"
              }`}
              onClick={() =>
                handleClick("course category", "/admin/coursecategories")
              }
            >
              <CategoryIcon isSelected={selected === "course category"} />
              <a className="flex items-start px-3 py-2">Course Categories</a>
            </div>

            {/* Users menu item */}
            <div
              className={`flex cursor-pointer items-center gap-1 ${styles.iconContainer} rounded px-2 ${
                selected === "users"
                  ? "bg-theme-primary text-white"
                  : "hover:bg-purple-100"
              }`}
              onClick={() => handleClick("users", "/admin/users")}
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
