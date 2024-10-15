import React from "react";

/**
 * Skeleton for listing the users in the admin side.
 */
const UserCardSkeleton = () => {
  return (
    <div className="mx-auto cursor-pointer flex h-auto w-full max-w-xs flex-col items-center rounded-lg bg-white p-4 shadow-lg animate-pulse">
      <div className="h-16 w-16 rounded-full bg-gray-300 md:h-20 md:w-20 lg:h-24 lg:w-24"></div>
      <div className="mt-4 h-6 w-3/4 rounded bg-gray-300"></div>
      <div className="mt-2 h-4 w-2/3 rounded bg-gray-300"></div>
    </div>
  );
};

export default UserCardSkeleton;
