import React from "react";

import { InboxIcon } from "../common/Icons";
import { useNavigate } from "react-router-dom";
import { getInitialsService } from "../../services/userManagementServices/profileServices";

/**
 * @param {*} param0 profile - Profile object of mentor
 * @returns Rendered profile box
 */
const MentorProfileBox = ({ profile, is_enrolled = false }) => {
  const navigate = useNavigate();

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
        {profile.profile_picture ? (
          <img
            src={`http://localhost:8000/${profile.profile_picture}`}
            className="mb-4 h-32 w-32 rounded-full border-4 border-gray-300 object-cover shadow-md md:mb-0"
          />
        ) : (
          <div className="mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-theme-primary object-cover text-xl font-bold text-white sm:text-2xl md:mb-0 md:text-4xl">
            {getInitialsService(profile.full_name)}
          </div>
        )}

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
              <InboxIcon defaultColor />
              <span>Inbox</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorProfileBox;
