import React from "react";

const LessonSkeleton = () => {
  // Array of placeholder lessons for loading state
  const skeletons = Array(5).fill(null);

  return (
    <div className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-0">
      {skeletons.map((_, index) => (
        <div
          key={index}
          className={`flex items-center justify-between border bg-slate-100 border-gray-300 p-4 shadow-md animate-pulse ${
            index === skeletons.length - 1 ? "" : "border-b-0"
          }`}
        >
          {/* Title placeholder */}
          <div className="w-3/4 h-5 bg-gray-300 rounded"></div>
        </div>
      ))}
    </div>
  );
};

export default LessonSkeleton;
