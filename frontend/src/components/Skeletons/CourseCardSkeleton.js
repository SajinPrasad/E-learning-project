import React from "react";

const CourseCardSkeleton = () => {
  return (
    <div className="cursor-pointer overflow-hidden rounded-lg border bg-white shadow-md duration-500 hover:scale-105">
      <div className="relative">
        {/* Skeleton for course preview image */}
        <div className="h-40 w-full bg-gray-300 animate-pulse"></div>
      </div>
      <div className="p-4">
        {/* Skeleton for course title */}
        <div className="h-6 w-3/4 bg-gray-300 rounded-md animate-pulse mb-2"></div>
        
        {/* Skeleton for mentor name */}
        <div className="h-4 w-1/2 bg-gray-300 rounded-md animate-pulse mb-2"></div>

        {/* Skeleton for price */}
        <div className="h-6 w-1/3 bg-gray-300 rounded-md animate-pulse mb-4"></div>

        {/* Skeleton for description */}
        <div className="h-4 w-full bg-gray-300 rounded-md animate-pulse mb-2"></div>
        <div className="h-4 w-5/6 bg-gray-300 rounded-md animate-pulse"></div>
      </div>
    </div>
  );
};

export default CourseCardSkeleton;
