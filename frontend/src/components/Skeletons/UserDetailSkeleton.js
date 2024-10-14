import React from "react";

const UserDetailsSkeleton = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="mx-auto my-10 w-2/5 animate-pulse rounded-lg bg-white p-6 shadow-lg">
        <div className="flex flex-col items-center sm:flex-row sm:items-start">
          <div className="h-32 w-32 flex-shrink-0 rounded-full bg-gray-300 sm:h-40 sm:w-40"></div>
          <div className="mt-6 w-full sm:ml-6 sm:mt-0">
            <div className="mb-2 h-8 w-3/4 rounded bg-gray-300"></div>
            <div className="mb-2 h-4 w-1/2 rounded bg-gray-300"></div>
            <div className="mb-2 h-4 w-1/4 rounded bg-gray-300"></div>
            <div className="mb-2 h-4 w-1/4 rounded bg-gray-300"></div>
            <div className="mb-2 h-4 w-1/4 rounded bg-gray-300"></div>
            <div className="mb-2 h-4 w-3/4 rounded bg-gray-300"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsSkeleton;
