import React from "react";

/**
 * Component for loading page
 */
const Loading = () => {
  return (
    <div>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100 bg-opacity-80">
        {/* Loading spinner or message */}
        <span className="relative flex h-16 w-16">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-500 opacity-75"></span>
          <span className="relative inline-flex h-16 w-16 rounded-full bg-theme-primary"></span>
        </span>
      </div>
    </div>
  );
};

export default Loading;
