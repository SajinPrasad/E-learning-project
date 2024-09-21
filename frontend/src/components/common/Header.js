import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import ProfileDropdown from "./ProfileDropdown";
import { CartIcon } from "./Icons";

/**
 * Header component
 */
const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, firstName, lastName, role } = useSelector(
    (state) => state.user,
  );
  const { profilePicture } = useSelector((state) => state.profile);
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

  const cartItems = useSelector((state) => state.cartItem.items);

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
                onClick={() => navigate("/")}
                className={`mr-5 cursor-pointer font-medium leading-6 text-gray-600 hover:text-gray-900`}
              >
                Home
              </a>
              <a
                onClick={() => navigate("/")}
                className={`cursor-pointe mr-5 font-medium leading-6 text-gray-600 hover:text-gray-900`}
              >
                Courses
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

          {isAuthenticated && role == "student" && (
            <div
              onClick={() => navigate("/cart")}
              className="relative mb-2 cursor-pointer md:mb-0 md:ml-auto"
            >
              <CartIcon />
              {/* Overlaping circle with cart item numbers */}
              {cartItems.length > 0 && (
                <div className="absolute left-0 top-0 flex h-[18px] w-[18px] -translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-full bg-theme-primary text-xs font-semibold text-white hover:bg-purple-600">
                  {cartItems.length}
                </div>
              )}
            </div>
          )}

          {isAuthenticated ? (
            <div
              ref={dropdownRef}
              className={`relative flex w-1/6 flex-col items-center justify-center`}
            >
              {profilePicture ? (
                <div
                  className={`flex aspect-square w-8 cursor-pointer items-center justify-center rounded-full bg-theme-primary text-white hover:border hover:border-theme-primary hover:bg-white hover:text-black`}
                  onClick={toggleDropdown}
                >
                  <img
                    src={`http://localhost:8000${profilePicture}`}
                    alt={firstName[0] + lastName[0]}
                    className="h-full w-full rounded-full object-cover"
                  />
                </div>
              ) : (
                <div
                  className={`flex aspect-square w-8 cursor-pointer items-center justify-center rounded-full bg-theme-primary text-white hover:border hover:border-theme-primary hover:bg-white hover:text-black`}
                  onClick={toggleDropdown}
                >
                  <p className="text-center font-sentinent-bold text-xs">
                    {firstName[0]}
                    {lastName[0]}
                  </p>
                </div>
              )}

              {isDropdownOpen && (
                <span className="absolute top-full w-full">
                  <ProfileDropdown role={role} />
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
                className={`whitespace-no-wrap inline-flex cursor-pointer items-center justify-center rounded-md border-2 border-transparent bg-theme-primary px-4 py-2 text-base font-medium leading-6 text-white shadow-sm hover:border-theme-primary hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2`}
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
