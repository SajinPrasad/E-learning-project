import React from "react";
import { StarIcon } from "../common/Icons";

// Rating component
const Rating = ({ rating, totalRatings }) => {
  const MAX_STARS = 5;
  const filledStars = Math.floor(rating); // Number of filled stars
  const hasHalfStar = rating % 1 !== 0; // Check if there's a half star

  return (
    <div className="flex gap-7 my-14 flex-col items-center overflow-visible">
      {" "}
      {/* Ensure container allows stars to be fully visible */}
      {/* Display the stars */}
      <div className="flex items-center">
        {Array.from({ length: MAX_STARS }, (_, index) => {
          // For each star, check if it's filled, half-filled, or empty
          if (index < filledStars) {
            return <StarIcon key={index} filled={true} />;
          } else if (index === filledStars && hasHalfStar) {
            return (
              <svg
                key={index}
                className="mx-1 h-10 w-10 text-yellow-400" // Added mx-1 for spacing
                fill="url(#half)"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                style={{ overflow: "visible" }} // Ensure half stars are visible
              >
                <defs>
                  <linearGradient id="half">
                    <stop offset="50%" stopColor="currentColor" />
                    <stop offset="50%" stopColor="transparent" />
                  </linearGradient>
                </defs>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.26 6.914a1 1 0 00.95.69h7.28c.967 0 1.371 1.24.588 1.81l-5.9 4.28a1 1 0 00-.364 1.118l2.26 6.914c.3.921-.755 1.688-1.538 1.118l-5.9-4.28a1 1 0 00-1.176 0l-5.9 4.28c-.783.57-1.838-.197-1.538-1.118l2.26-6.914a1 1 0 00-.364-1.118l-5.9-4.28c-.783-.57-.379-1.81.588-1.81h7.28a1 1 0 00.95-.69l2.26-6.914z"
                ></path>
              </svg>
            );
          } else {
            return <StarIcon key={index} filled={false} />;
          }
        })}
      </div>
      <div className="flex flex-col items-center space-x-2 text-xl font-bold md:flex-row">
        <h1 className="text-3xl text-yellow-700 sm:text-5xl md:text-6xl">
          {rating}
        </h1>
        <h2 className="text-lg font-semibold text-yellow-700 md:text-xl">
          Course Rating
        </h2>
        <span className="text-sm font-normal text-gray-600">
          ({totalRatings ? `${totalRatings} Ratings` : "No ratings yet"})
        </span>
      </div>
    </div>
  );
};

export default Rating;
