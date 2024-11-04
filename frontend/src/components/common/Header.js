import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import ProfileDropdown from "./ProfileDropdown";
import { CartIcon } from "./Icons";
import CategoryDropdown from "./CategoryDropdown";
import SearchBar from "./SearchBar";
import { getCartItems } from "../../services/cartServices";

const Header = (cartItemNumbers = 0) => {
  const navigate = useNavigate();
  const { isAuthenticated, firstName, lastName, role } = useSelector(
    (state) => state.user,
  );
  const { profilePicture } = useSelector((state) => state.profile);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [cartItems, setCartItems] = useState([]);

  console.log("Profile picture: ", profilePicture);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    const fetchCartItems = async () => {
      const fetchedCartItems = await getCartItems();

      if (fetchedCartItems) {
        setCartItems(fetchedCartItems);
      }
    };

    if (isAuthenticated) {
      fetchCartItems();
    }
  }, [cartItemNumbers]);

  useEffect(() => {
    if (selectedCategory) {
      navigate(`/courses/?category=${selectedCategory}`);
    }

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen, selectedCategory]);

  useEffect(() => {
    if (searchTerm) {
      if (isAuthenticated && role === "admin") {
        navigate(`/admin/courses/?q=${searchTerm}`);
      } else if (isAuthenticated && role === "mentor") {
        navigate(`/mentor/courses/?q=${searchTerm}`);
      } else {
        navigate(`/courses/?q=${searchTerm}`);
      }
    } else if (selectedCategory) {
      if (isAuthenticated && role === "admin") {
        navigate(`/admin/courses/?category=${selectedCategory}`);
      } else if (isAuthenticated && role === "mentor") {
        navigate(`/mentor/courses/?category=${selectedCategory}`);
      } else {
        navigate(`/courses/?category=${selectedCategory}`);
      }
    }
  }, [searchTerm, selectedCategory]);

  const handleHomeNavigation = () => {
    if (role === "mentor") {
      navigate("/mentor");
    } else if (role === "admin") {
      navigate("/admin");
    } else {
      navigate("/");
    }
  };

  return (
    <section className="sticky top-0 w-full border border-b-gray-100 bg-white bg-opacity-90 px-4 text-gray-700 backdrop-blur-md">
      <div className="container mx-auto flex max-w-7xl flex-col flex-wrap items-center justify-between py-2 md:flex-row">
        <div className="relative flex flex-col md:flex-row">
          <p className="mb-2 flex items-center font-medium text-gray-900 md:mb-0 lg:w-auto lg:items-center lg:justify-center">
            <span className="mx-auto select-none text-xl font-black leading-none text-theme-primary">
              Brain Bridge<span className="text-theme-primary">.</span>
            </span>
          </p>
          <nav className="mb-3 flex flex-wrap items-center text-base md:mb-0 md:ml-8 md:border-l md:border-gray-200 md:pl-8">
            <div className="mr-5">
              <p
                onClick={handleHomeNavigation}
                className="cursor-pointer font-medium leading-6 text-gray-600 hover:text-gray-900"
              >
                {(isAuthenticated && role === "mentor") ||
                (isAuthenticated && role === "admin")
                  ? "Dashboard"
                  : "Home"}
              </p>
            </div>
            <div className="mr-5">
              <p
                onClick={() => navigate("/Courses")}
                className="cursor-pointer font-medium leading-6 text-gray-600 hover:text-gray-900"
              >
                Courses
              </p>
            </div>
            <div
              className="relative my-auto mr-5 mt-5"
              onMouseEnter={() => setIsCategoryDropdownOpen(true)}
              onMouseLeave={() => setIsCategoryDropdownOpen(false)}
            >
              <p className="cursor-pointer font-medium leading-6 text-gray-600 hover:text-gray-900">
                Categories
              </p>
              <CategoryDropdown
                setSelectedCategory={setSelectedCategory}
                isOpen={isCategoryDropdownOpen}
                header={true}
              />
            </div>
          </nav>
        </div>

        <div>
          <SearchBar setSearchTerm={setSearchTerm} />
        </div>

        {isAuthenticated && role === "student" && (
          <div
            onClick={() => navigate("/cart")}
            className="relative mb-2 cursor-pointer md:mb-0 md:ml-auto"
          >
            <CartIcon />
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
            className="relative flex w-1/6 flex-col items-center justify-center"
          >
            {profilePicture ? (
              <div
                className="flex aspect-square w-8 cursor-pointer items-center justify-center rounded-full bg-theme-primary text-white hover:border hover:border-theme-primary hover:bg-white hover:text-black"
                onClick={toggleDropdown}
              >
                <img
                  src={profilePicture}
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
            ) : (
              <div
                className="flex aspect-square w-8 cursor-pointer items-center justify-center rounded-full bg-theme-primary text-white hover:border hover:border-theme-primary hover:bg-white hover:text-black"
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
          <div className="ml-5 inline-flex items-center space-x-6 lg:justify-end">
            <a
              onClick={() => navigate("/login")}
              className="whitespace-no-wrap cursor-pointer text-base font-medium leading-6 text-gray-600 transition duration-150 ease-in-out hover:text-gray-900"
            >
              Sign in
            </a>
            <a
              onClick={() => navigate("/register")}
              className="whitespace-no-wrap inline-flex cursor-pointer items-center justify-center rounded-md border-2 border-transparent bg-theme-primary px-4 py-2 text-base font-medium leading-6 text-white shadow-sm hover:border-theme-primary hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
            >
              Sign up
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default Header;
