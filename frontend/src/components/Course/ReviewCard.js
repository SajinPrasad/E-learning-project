import React, { useState } from "react";
import { ReactStarsWrapper } from "../common";
import { CloseIcon } from "../common/Icons";

const getInitials = (name) => {
  const [firstName, lastName] = name.split(" ");
  return `${firstName[0]}${lastName ? lastName[0] : ""}`;
};

const ReviewCard = ({ review }) => {
  const { rating, review_text, profile_picture, user_fullname } = review;
  const [isExpanded, setIsExpanded] = useState(false);

  // Function to truncate the text to 55 words
  const getTruncatedText = (text) => {
    return text.split(" ").slice(0, 56).join(" ");
  };

  const handleSeeMore = () => {
    setIsExpanded(true);
  };

  const handleCloseModal = () => {
    setIsExpanded(false);
  };

  return (
    <div>
      {/* Main review card */}
      <div className="flex h-80 items-start space-x-4 rounded-lg bg-white p-3 shadow-md">
        <div className="flex-shrink-0">
          {profile_picture ? (
            <img
              className="h-11 w-11 rounded-full object-cover"
              src={`http://localhost:8000/${profile_picture}`}
              alt={getInitials(user_fullname)}
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-500 font-bold text-white">
              {getInitials(user_fullname)}
            </div>
          )}
        </div>
        <div>
          <h2 className="text-lg font-semibold">{user_fullname}</h2>
          <div className="mb-2 flex items-center">
            <div className="flex items-center">
              <ReactStarsWrapper
                value={parseFloat(rating)}
                edit={false}
                size={20}
              />
            </div>
          </div>
          <p className="text-gray-700">
            {getTruncatedText(review_text)}
            {review_text.split(" ").length > 75 && (
              <button
                className="ml-2 text-xs font-semibold text-gray-500"
                onClick={handleSeeMore}
              >
                See More
              </button>
            )}
          </p>
        </div>
      </div>

      {/* Modal for expanded review */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-5/6 rounded bg-white p-5 shadow-lg">
            {/* Close button positioned in the top-right corner */}
            <button
              className="absolute right-4 top-4"
              onClick={handleCloseModal}
            >
              <CloseIcon />
            </button>

            <div className="flex gap-2">
              <div className="flex-shrink-0">
                {profile_picture ? (
                  <img
                    className="h-11 w-11 rounded-full object-cover"
                    src={`http://localhost:8000/${profile_picture}`}
                    alt={getInitials(user_fullname)}
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-500 font-bold text-white">
                    {getInitials(user_fullname)}
                  </div>
                )}
              </div>
              <h2 className="mb-4 mt-2 text-lg font-semibold">
                {user_fullname}
              </h2>
            </div>

            <div className="mb-4 flex">
              <ReactStarsWrapper
                value={parseFloat(rating)}
                edit={false}
                size={27}
              />
            </div>

            <p className="mb-4 text-gray-700">{review_text}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
