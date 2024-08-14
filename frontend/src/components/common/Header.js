import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import ProfileDropdown from "./ProfileDropdown";

/**
 * Header component
 */
const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, firstName, lastName } = useSelector(
    (state) => state.user,
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Toggles the dropdown menu's visibility by flipping the current state.
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  // Closes the dropdown if a click event occurs outside of the dropdown element.
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  // Adds an event listener to detect clicks outside the dropdown when it is open.
  // Removes the event listener when the dropdown is closed or when the component unmounts.
  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <>
      <section
        className={`sticky top-0 w-full border border-b-gray-100 bg-white bg-opacity-90 px-4 text-gray-700 backdrop-blur-md`}
      >
        <div
          className={`container mx-auto flex max-w-7xl flex-col flex-wrap items-center justify-between py-5 md:flex-row`}
        >
          <div className={`relative flex flex-col md:flex-row`}>
            <a
              href="#_"
              className={`mb-5 flex items-center font-medium text-gray-900 md:mb-0 lg:w-auto lg:items-center lg:justify-center`}
            >
              <span
                className={`mx-auto select-none text-xl font-black leading-none text-theme-primary`}
              >
                Brain Bridge<span className={`text-theme-primary`}>.</span>
              </span>
            </a>
            <nav
              className={`mb-5 flex flex-wrap items-center text-base md:mb-0 md:ml-8 md:border-l md:border-gray-200 md:pl-8`}
            >
              <a
                href="#_"
                className={`mr-5 font-medium leading-6 text-gray-600 hover:text-gray-900`}
              >
                Home
              </a>
              <a
                href="#_"
                className={`mr-5 font-medium leading-6 text-gray-600 hover:text-gray-900`}
              >
                Features
              </a>
              <a
                href="#_"
                className={`mr-5 font-medium leading-6 text-gray-600 hover:text-gray-900`}
              >
                Pricing
              </a>
              <a
                href="#_"
                className={`mr-5 font-medium leading-6 text-gray-600 hover:text-gray-900`}
              >
                Blog
              </a>
            </nav>
          </div>

          {isAuthenticated ? (
            <div
              ref={dropdownRef}
              className={`relative ml-auto flex w-1/6 flex-col items-center justify-center`}
            >
              <div
                className={`flex aspect-square w-8 cursor-pointer items-center justify-center rounded-full bg-theme-primary text-white hover:border hover:border-theme-primary hover:bg-white hover:text-black`}
                onClick={toggleDropdown}
              >
                <p className="text-center font-sentinent-bold text-xs">
                  {firstName[0]}
                  {lastName[0]}
                </p>
              </div>
              {isDropdownOpen && (
                <span className="absolute top-full w-full">
                  <ProfileDropdown />
                </span>
              )}
            </div>
          ) : (
            <div
              className={`ml-5 inline-flex items-center space-x-6 lg:justify-end`}
            >
              <a
                onClick={() => navigate("/login")}
                className={`whitespace-no-wrap cursor-pointer text-base font-medium leading-6 text-gray-600 transition duration-150 ease-in-out hover:text-gray-900`}
              >
                Sign in
              </a>
              <a
                onClick={() => navigate("/register")}
                className={`whitespace-no-wrap inline-flex cursor-pointer items-center justify-center rounded-md border-2 border-transparent bg-theme-primary px-4 py-2 text-base font-medium leading-6 text-white shadow-sm hover:border-theme-primary hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2`}
              >
                Sign up
              </a>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Header;
