import React from "react";

import { InboxIcon } from "../common/Icons";
import { useNavigate } from "react-router-dom";

/**
 * @param {*} param0 profile - Profile object of mentor
 * @returns Rendered profile box
 */
const MentorProfileBox = ({ profile, is_enrolled = false }) => {
  const navigate = useNavigate();

  const getInitials = (fullName) => {
    const names = fullName?.split(" ");
    if (names.length < 2) return fullName?.charAt(0); // Handle case with no space
    const firstInitial = names[0].charAt(0);
    const lastInitial = names[names.length - 1].charAt(0);
    return `${firstInitial}${lastInitial}`;
  };

  // Setting user id in state and navigating to inbox
  const handleInboxClick = () => {
    navigate("/inbox", { state: { userId: profile.user_id } });
  };

  return (
    <div
      className={`my-8 rounded bg-white p-8 ${is_enrolled ? "shadow-sm" : "shadow-lg"} `}
    >
      {is_enrolled ? (
        <h2 className="mb-2 text-lg font-bold md:text-2xl">Mentor Profile</h2>
      ) : (
        <h2 className="mb-6 text-2xl font-bold md:text-3xl">Mentor Profile</h2>
      )}

      <div className="flex flex-col items-center text-center md:flex-row md:text-left">
        {/* Larger Mentor Image */}
        <img
          src={`http://localhost:8000/${profile.profile_picture}`}
          alt={getInitials(profile.full_name)}
          className="mb-4 h-32 w-32 rounded-full border-4 border-gray-300 object-cover shadow-md md:mb-0"
        />
        {/* Mentor Details */}
        <div className="ml-0 md:ml-6">
          {/* Full Name */}
          <h4 className="text-2xl font-semibold text-gray-800">
            {profile.full_name}
          </h4>

          {/* Mentor Bio */}
          <p className="mt-2 text-lg text-gray-900">
            <span className="text-md font-semibold text-gray-700">Bio: </span>
            {profile.bio}
          </p>

          {/* Education */}
          <p className="mt-2 text-lg text-gray-900">
            <span className="text-md font-semibold text-gray-700">
              Education:{" "}
            </span>
            {profile.highest_education_level}
          </p>

          {/* Experience */}
          <p className="mt-2 text-lg text-gray-900">
            <span className="text-md font-semibold text-gray-700">
              Experience:{" "}
            </span>
            {profile.experience}
          </p>

          {is_enrolled && (
            <p
              onClick={handleInboxClick}
              className="mt-5 flex cursor-pointer gap-2 text-xs text-gray-500"
            >
              <InboxIcon />
              <span className="mt-1">Inbox</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorProfileBox;
