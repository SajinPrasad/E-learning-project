import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { IconProfile, Logout, Settings } from "./Icons";
import { clearUserInfo } from "../../features/tempUser/userSlice";
import { clearToken } from "../../features/auth/authSlice";
import { clearCartItems } from "../../features/cartItem/cartItemSlice";
import { userLogoutService } from "../../services/userManagementServices/authService";
import { clearCoursesState } from "../../features/course/courseSlice";
import { clearTempUser } from "../../features/tempUser/tempUserSlice";
import { clearEnrolledCoursesState } from "../../features/course/enrolledCoursesState";
import { clearProfileInfo } from "../../features/tempUser/profileSlice";
import Loading from "./Loading";

/**
 * Renders the dropdown from the profile icon on header.
 */
const ProfileDropdown = ({ role }) => {
  const { firstName, lastName } = useSelector((state) => state.user);
  const { profilePicture } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const refreshToken = useSelector((state) => state.auth.refreshToken);
  const [isLoading, setIsLoading] = useState(false);

  // Function to handle logout.
  const handleLogout = async () => {
    setIsLoading(true);
    const loggedOut = await userLogoutService(refreshToken);

    if (loggedOut) {
      // Clearing all states and navigating to home

      dispatch(clearUserInfo());
      dispatch(clearToken());
      dispatch(clearCartItems());
      dispatch(clearCoursesState());
      dispatch(clearTempUser());
      dispatch(clearEnrolledCoursesState());
      dispatch(clearProfileInfo());
      navigate("/");
      setIsLoading(false);
    }
  };

  const handleNavigate = () => {
    if (role == "student") {
      navigate("/profile");
    } else if (role === "mentor") {
      console.log("YEs ist");
      navigate("/mentor/profile");
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <article className="rounded bg-white px-4 pb-4 drop-shadow-lg">
        <ul className="mt-4 flex flex-col gap-4 pl-2">
          <li className="flex gap-2">
            <span className="flex items-center gap-2">
              {profilePicture ? (
                <img
                  className="h-6 w-6 rounded-lg"
                  src={`http://localhost:8000${profilePicture}`}
                />
              ) : (
                <div className="flex aspect-square w-8 cursor-pointer items-center justify-center rounded-full bg-theme-primary text-white">
                  <p className="text-center font-sentinent-bold text-xs">
                    {firstName[0]}
                    {lastName[0]}
                  </p>
                </div>
              )}

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
            <p className="cursor-pointer" onClick={handleLogout}>
              Logout
            </p>
          </li>
        </ul>
      </article>
    </>
  );
};

export default ProfileDropdown;
