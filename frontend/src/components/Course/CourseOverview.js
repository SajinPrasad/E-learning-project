import React from "react";

const CourseOverview = ({ course }) => {
  console.log("Course Provided: ", course);

  return (
    <div>
      <div className="mx-auto mt-1 flex flex-col gap-5 p-6 md:mt-4">
        {/* Course description */}
        <div className="mt-1 md:mx-auto p-2 shadow-sm md:w-2/3">
          <h2 className="text-lg mb-2 font-bold md:text-2xl">Description</h2>
          <h5 className="text-gray-700">
            {course?.description || "No description available."}
          </h5>
        </div>

        {/* Course requirement */}
        <div className="mt-6 md:mt-3 md:mx-auto p-2 shadow-sm md:w-2/3">
          <h2 className="text-lg mb-2 font-bold md:text-2xl">Requirements</h2>
          <h5 className="text-gray-700">
            {course?.requirements?.description || "No requirements specified."}
          </h5>
        </div>
      </div>
    </div>
  );
};

export default CourseOverview;
