import React from "react";
import { MentorProfileBox } from "../Profile";

const CourseOverview = ({ course }) => {

  return (
    <div>
      <div className="mx-auto mt-1 flex flex-col gap-5 p-3">
        {/* Mentor profile details */}
        <div className="mt-1 p-2 md:mx-auto md:w-2/3">
          <MentorProfileBox
            is_enrolled={true}
            profile={course.mentor_profile}
          />
        </div>

        {/* Course description */}
        <div className="mt-1 p-2 shadow-sm md:mx-auto md:w-2/3">
          <h2 className="mb-2 text-lg font-bold md:text-2xl">Description</h2>
          <h5 className="text-gray-700">
            {course?.description || "No description available."}
          </h5>
        </div>

        {/* Course requirement */}
        <div className="mt-6 p-2 shadow-sm md:mx-auto md:mt-3 md:w-2/3">
          <h2 className="mb-2 text-lg font-bold md:text-2xl">Requirements</h2>
          <h5 className="text-gray-700">
            {course?.requirements?.description || "No requirements specified."}
          </h5>
        </div>
      </div>
    </div>
  );
};

export default CourseOverview;
