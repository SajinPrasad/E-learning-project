import React, { useState } from "react";

import { getInitialsService } from "../../../services/userManagementServices/profileServices";
import { CloseIcon } from "../../common/Icons";
import { updateUserActive } from "../../../services/userManagementServices/userManagementServices";
import { UserDetailsSkeleton } from "../../Skeletons";


/**
 * Component which renders User information cards.
 * @param {*} param0 - user object which includes all user and profile information.
 */
const UserListCard = ({ user }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    is_blocked,
    is_verified,
    role,
    profile: {
      profile_picture,
      bio,
      first_name,
      last_name,
      email,
      experience,
      highest_education_level,
      date_of_birth,
    },
  } = user;

  const [userIsBlocked, setUserIsBlocked] = useState(is_blocked);

  const handleUserActiveUpdate = async () => {
    setIsLoading(true)
    const response = await updateUserActive(user.profile.user, !userIsBlocked);
    if (response) {
      setUserIsBlocked((prev) => !prev);
      setIsLoading(false)
    }
  };

  // Function to capitalize the first letter of each word
  const capitalizeFirstLetter = (string) => {
    return string
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  if (isLoading) {
    return <UserDetailsSkeleton />
  }

  return (
    <>
      <div
        onClick={() => setIsExpanded((prev) => !prev)}
        className="mx-auto flex h-auto w-full cursor-pointer flex-col items-center rounded-lg bg-white p-3 shadow-lg"
      >
        {userIsBlocked && (
          <span className="self-start rounded bg-red-50 px-2 text-xs italic text-red-400">
            *Blocked
          </span>
        )}
        {profile_picture ? (
          <img
            src={`http://localhost:8000${profile_picture}`}
            className="h-14 w-14 rounded-full md:h-16 md:w-16 lg:h-20 lg:w-20"
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-theme-primary text-lg font-bold text-white md:h-16 md:w-16 md:text-xl lg:h-20 lg:w-20">
            {getInitialsService(first_name + " " + last_name)}
          </div>
        )}
        <h1 className="mt-2 text-center text-lg font-semibold">
          {first_name + " " + last_name}
        </h1>
        <h4 className="text-center text-sm text-gray-600">{email}</h4>
      </div>

      {/* Expanded view of user details */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="mx-auto my-10 w-2/5 rounded-lg bg-white p-6 shadow-lg">
            <div
              onClick={() => setIsExpanded((prev) => !prev)}
              className="flex cursor-pointer justify-end"
            >
              <CloseIcon />
            </div>
            <div className="flex flex-col items-center sm:flex-row sm:items-start">
              <div className="h-32 w-32 flex-shrink-0 sm:h-40 sm:w-40">
                {profile_picture ? (
                  <img
                    src={`http://localhost:8000${profile_picture}`}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-theme-primary text-xl font-semibold text-white md:text-2xl lg:text-4xl">
                    {first_name[0]}
                    {last_name[0]} {/* Show initials if no picture */}
                  </div>
                )}
              </div>
              <div className="mt-6 sm:ml-6 sm:mt-0">
                <h1 className="text-2xl font-bold">
                  {first_name} {last_name}
                </h1>
                <p className="text-gray-600">{email}</p>
                <p className="text-sm text-gray-500">
                  Role:{" "}
                  <span className="font-semibold">
                    {capitalizeFirstLetter(role)}
                  </span>
                </p>
                <div className="my-2 flex gap-2">
                  <p
                    className={`text-sm font-medium ${!userIsBlocked ? "text-green-500" : "text-red-500"}`}
                  >
                    {!userIsBlocked ? "Active" : "Blocked"}
                  </p>
                  <button
                    onClick={handleUserActiveUpdate}
                    className="bg-gray-200 px-2 text-xs font-semibold text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                  >
                    {!userIsBlocked ? "Block user" : "Unblock user"}
                  </button>
                </div>
                <p
                  className={`text-sm font-medium ${is_verified ? "text-blue-500" : "text-gray-500"}`}
                >
                  {is_verified ? "Verified" : "Not Verified"}
                </p>
                {bio && (
                  <p className="mt-4 text-gray-800">
                    <strong>Bio:</strong> {bio}
                  </p>
                )}
                {experience && (
                  <p className="mt-2 text-gray-800">
                    <strong>Experience:</strong> {experience} years
                  </p>
                )}
                {highest_education_level && (
                  <p className="mt-2 text-gray-800">
                    <strong>Education Level:</strong>{" "}
                    {capitalizeFirstLetter(highest_education_level)}
                  </p>
                )}
                {date_of_birth && (
                  <p className="mt-2 text-gray-800">
                    <strong>Date of Birth:</strong>{" "}
                    {new Date(date_of_birth).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserListCard;
