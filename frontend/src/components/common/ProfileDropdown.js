import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { IconProfile, Logout, Settings } from "./Icons";
import Loading from "./Loading";
import { logoutUser } from "../../features/auth/authActuion";

/**
 * Renders the dropdown from the profile icon on header.
 */
const ProfileDropdown = ({ role }) => {
  const { firstName, lastName } = useSelector((state) => state.user);
  const { profilePicture } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Function to handle logout.
  const handleLogout = async () => {
    setIsLoading(true);

    const loggedOut = await dispatch(logoutUser());

    if (loggedOut) {
      // Navigate to home only after successful logout
      navigate("/");
    }
  };

  const handleNavigate = () => {
    if (role === "student") {
      navigate("/profile");
    } else if (role === "mentor") {
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
                  src={profilePicture}
                  alt={"Profile"}
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
            className="flex cursor-pointer gap-2 hover:text-theme-primary"
          >
            <IconProfile />

            <p>Your Profile</p>
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
