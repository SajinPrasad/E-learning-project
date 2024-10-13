import React from "react";

const EnrolledCoursesSkeleton = () => {
  return (
    <>
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="flex flex-col cursor-pointer items-start rounded border border-gray-300 p-4 animate-pulse"
        >
          {/* Skeleton for course image */}
          <div className="h-36 w-full rounded bg-gray-300 object-cover md:h-40"></div>

          {/* Skeleton for course details */}
          <div className="mt-2 flex flex-col w-full">
            {/* Skeleton for course title */}
            <div className="h-6 w-3/4 bg-gray-300 rounded-md mb-2"></div>
            {/* Skeleton for mentor name */}
            <div className="h-4 w-1/2 bg-gray-300 rounded-md"></div>
          </div>
        </div>
      ))}
    </>
  );
};

export default EnrolledCoursesSkeleton;
