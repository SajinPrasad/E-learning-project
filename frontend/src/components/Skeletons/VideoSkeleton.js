import React from "react";

const VideoSkeleton = () => {
  return (
    <div className="relative mb-3 w-full">
      {/* Video Skeleton Placeholder */}
      <div className="h-[400px] max-h-[75vh] w-full animate-pulse bg-gray-300 border border-gray-400 shadow-lg rounded relative">
        {/* Play Button (Skeleton) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-gray-400 flex items-center justify-center shadow-lg">
            {/* Play Triangle */}
            <div
              className="w-0 h-0 border-l-[16px] border-l-gray-100 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent"
            ></div>
          </div>
        </div>
      </div>

      {/* Video Time Progress Bar (Skeleton) */}
      <div className="mt-3 h-4 w-full bg-gray-300 animate-pulse rounded shadow-lg"></div>

      {/* Previous and Next Arrows (Skeleton) */}
      <div className="absolute left-2 top-1/2 -translate-y-1/2 transform bg-gray-400 p-3 shadow-lg w-10 h-10 rounded-full animate-pulse"></div>
      <div className="absolute right-2 top-1/2 -translate-y-1/2 transform bg-gray-400 p-3 shadow-lg w-10 h-10 rounded-full animate-pulse"></div>
    </div>
  );
};

export default VideoSkeleton;
