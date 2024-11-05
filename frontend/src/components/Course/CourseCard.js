import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * Course card for displaying courses in cards
 * @param {*} param0 - course - Course to display in the card
 * @param {*} param1 - role - Role of the user, For adjusting the view based on differet users
 * @returns
 */
const CourseCard = ({ course, role }) => {
  const { id, title, description, price, mentor_name } = course;

  // Truncate description to 15 words
  const truncatedDescription =
    description?.split(" ").slice(0, 12).join(" ") +
    (description?.split(" ").length > 12 ? "..." : "");
  const navigate = useNavigate();

  const handleNavigation = () => {
    if (role) {
      navigate(`/${role}/course/${id}`);
    } else {
      navigate(`/course/${id}`);
    }
  };

  return (
    <div
      onClick={handleNavigation}
      className="mb-3 cursor-pointer overflow-hidden rounded-lg border bg-white shadow-md duration-500 hover:scale-105"
    >
      <div className="relative">
        <img
          src={`${course.preview_image}`}
          alt="Course Preview"
          className="h-40 w-full object-cover"
        />
        {price?.amount === "0.00" && (
          <div className="absolute left-0 top-0 bg-black bg-opacity-50 p-2 text-sm font-semibold text-white">
            *Free
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="mb-1 text-lg font-semibold">{title}</h3>
        <p className="my-1 text-[10px] text-gray-500">{course.category_path}</p>
        {role !== "mentor" && (
          <h4 className="text-xs font-semibold text-gray-600">{mentor_name}</h4>
        )}
        <p className="my-1 rounded border border-gray-50 font-sentinent-medium text-xl">
          ₹ {price?.amount}
        </p>
        <p className="text-sm text-gray-600">{truncatedDescription}</p>
      </div>
    </div>
  );
};

export default CourseCard;
