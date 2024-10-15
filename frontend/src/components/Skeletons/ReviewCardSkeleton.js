import React from "react";

const ReviewCardSkeleton = () => {
  return (
    <div className="flex h-60 items-start space-x-4 rounded-lg bg-white p-3 shadow-md animate-pulse">
      <div className="flex-shrink-0">
        <div className="h-12 w-12 rounded-full bg-gray-300"></div>
      </div>
      <div className="w-full">
        <div className="h-4 w-1/4 bg-gray-300 mb-2"></div>
        <div className="h-4 w-1/3 bg-gray-300 mb-4"></div>
        <div className="space-y-2">
          <div className="h-3 w-full bg-gray-300"></div>
          <div className="h-3 w-full bg-gray-300"></div>
          <div className="h-3 w-3/4 bg-gray-300"></div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCardSkeleton;