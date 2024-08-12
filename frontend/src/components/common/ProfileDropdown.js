import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { IconProfile, Logout, Settings } from "./Icons";
import { logout } from "../../features/tempUser/authSlice";
import { clearUserInfo } from "../../features/tempUser/userSlice";

/**
 * Renders the dropdown from the profile icon on header.
 */
const ProfileDropdown = () => {
  const { firstName, lastName } = useSelector((state) => state.user);
  const dispatch = useDispatch()

  // Function to handle logout.
  const handleLogout = () => {
    // Clearing the tokens from state.
    dispatch(logout());

    // Clearing the user information from state.
    dispatch(clearUserInfo());
  };

  return (
    <>
      <article className="rounded bg-white px-4 pb-4 drop-shadow-lg">
        <ul className="mt-4 flex flex-col gap-4 pl-2">
          <li className="flex gap-2">
            <span className="flex gap-2">
              <img
                className="h-6 w-6 rounded-lg"
                src="https://lh3.googleusercontent.com/a/AGNmyxbSlMgTRzE3_SMIxpDAhpNad-_CN5_tmph1NQ1KhA=s96-c"
                alt=""
              />

              <span className={`text-sm font-bold`}>
                {firstName} {lastName}
              </span>
            </span>
          </li>
          <li className="flex gap-2 hover:text-theme-primary">
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
