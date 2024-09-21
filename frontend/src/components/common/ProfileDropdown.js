import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { IconProfile, Logout, Settings } from "./Icons";
import { clearUserInfo } from "../../features/tempUser/userSlice";
import { clearToken } from "../../features/auth/authSlice";
import { clearCartItems } from "../../features/cartItem/cartItemSlice";

/**
 * Renders the dropdown from the profile icon on header.
 */
const ProfileDropdown = ({role}) => {
  const { firstName, lastName } = useSelector((state) => state.user);
  const { profilePicture } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Function to handle logout.
  const handleLogout = () => {
    // Clearing the user information from state.
    dispatch(clearToken());
    dispatch(clearUserInfo());
    dispatch(clearCartItems());
  };

  const handleNavigate = () => {
    if (role == "student") {
      navigate("/profile")
    } else if (role === "mentor") {
      console.log("YEs ist")
      navigate("/mentor/profile")
    }
  }

  return (
    <>
      <article className="rounded bg-white px-4 pb-4 drop-shadow-lg">
        <ul className="mt-4 flex flex-col gap-4 pl-2">
          <li className="flex gap-2">
            <span className="flex gap-2">
              <img
                className="h-6 w-6 rounded-lg"
                src={`http://localhost:8000${profilePicture}`}
                alt=""
              />

              <span className={`text-sm font-bold`}>
                {firstName} {lastName}
              </span>
            </span>
          </li>
          <li
            onClick={handleNavigate}
            className="flex gap-2 hover:text-theme-primary"
          >
            <IconProfile />

            <a href="">Your Profile</a>
          </li>

          <li className="flex gap-2 hover:text-theme-primary">
            <Settings />

            <a href="">Settings</a>
          </li>
          <li className="flex gap-2 hover:text-theme-primary">
            <Logout />
            <a onClick={handleLogout} href="">
              Logout
            </a>
          </li>
        </ul>
      </article>
    </>
  );
};

export default ProfileDropdown;
