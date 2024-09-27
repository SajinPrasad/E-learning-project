import React, { useEffect } from "react";

import { ReactStarsWrapper } from "../common";

const CourseRating = ({ size, courseRating, reviewUpdated }) => {
  useEffect(() => {}, [reviewUpdated]);
  return (
    <div className="mx-auto mb-10 flex w-auto flex-col items-center justify-center space-y-4 border-b-2 border-gray-200 pb-4 text-center md:w-2/3">
      <ReactStarsWrapper
        value={courseRating.average_rating}
        edit={false}
        size={size}
      />
      <div className="flex flex-col items-center space-x-2 text-xl font-bold md:flex-row">
        <h1 className="text-3xl text-yellow-700 sm:text-5xl md:text-6xl">
          {courseRating.average_rating}
        </h1>
        <h2 className="text-lg font-semibold text-yellow-700 md:text-xl">
          Course Rating
        </h2>
        <span className="text-sm font-normal text-gray-600">
          ({courseRating.total_reviews ? "Ratings" : "No ratings yet"})
        </span>
      </div>
    </div>
  );
};

export default CourseRating;
