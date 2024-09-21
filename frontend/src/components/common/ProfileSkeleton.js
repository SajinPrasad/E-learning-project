import React from "react";

const ProfileSkeleton = () => {
  return (
    <div className="flex items-center justify-center space-x-12 bg-white p-12">
      <div className="mx-auto w-full max-w-sm rounded-md border border-purple-300 p-4 shadow">
        <div className="flex animate-pulse space-x-4">
          <div className="h-12 w-12 rounded-full opacity-50 bg-theme-primary"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 w-3/4 rounded opacity-50 bg-theme-primary"></div>
            <div className="space-y-2">
              <div className="h-4 rounded opacity-50 bg-theme-primary"></div>
              <div className="h-4 w-5/6 rounded opacity-50 bg-theme-primary"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
