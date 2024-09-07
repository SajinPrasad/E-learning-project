import React from "react";
import { useNavigate } from "react-router-dom";

const CourseCard = ({ course }) => {
  const { id, title, description, price } = course;
  // Truncate description to 25 words
  const truncatedDescription =
    description.split(" ").slice(0, 25).join(" ") +
    (description.split(" ").length > 25 ? "..." : "");

  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/mentor/course/${id}`)}
      className="cursor-pointer overflow-hidden rounded-lg border bg-white shadow-md"
    >
      <div className="relative">
        <img
          src={`${course.preview_image}`}
          alt="Course Preview"
          className="h-40 w-full object-cover"
        />
        {price.amount === "0.00" && (
          <div className="absolute left-0 top-0 bg-black bg-opacity-50 p-2 text-sm font-semibold text-white">
            *Free
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="mb-1 text-lg font-semibold">{title}</h3>
        <p className="rounded border border-gray-50 font-sentinent-medium text-lg">
          ₹ {price.amount}
        </p>
        <p className="text-gray-600">{truncatedDescription}</p>
      </div>
    </div>
  );
};

export default CourseCard;
