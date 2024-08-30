import React from "react";

const CourseCard = ({ course }) => {
  const { title, description } = course;
  // Truncate description to 25 words
  const truncatedDescription =
    description.split(" ").slice(0, 25).join(" ") +
    (description.split(" ").length > 25 ? "..." : "");

  return (
    <div className="overflow-hidden rounded-lg border bg-white shadow-md">
      <div className="relative">
        <img src={`${course.preview_image}`} alt="Video Preview" className="h-40 w-full object-cover" />
        <div className="absolute left-0 top-0 bg-black bg-opacity-50 p-2 text-xs font-semibold text-white">
          Preview
        </div>
      </div>
      <div className="p-4">
        <h3 className="mb-2 text-lg font-semibold">{title}</h3>
        <p className="text-gray-600">{truncatedDescription}</p>
      </div>
    </div>
  );
};

export default CourseCard;
