import React, { useState, useEffect, useRef } from "react";
import { DropDownArrow, RightArrow } from "./Icons";

const CategoryDropdown = ({ categories, selectedCategory, setSelectedCategory, setFieldValue }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false); // State to manage dropdown visibility
  const [hoveredParent, setHoveredParent] = useState(null); // State to track the hovered parent category
  const dropdownRef = useRef(null); // Ref for the dropdown to detect outside clicks

  // Filter parent categories (categories without a parent)
  const parentCategories = categories.filter(
    (category) => category.parent === null
  );

  // Filter child categories (categories with a parent)
  const childCategories = categories.filter(
    (category) => category.parent !== null
  );

  // Handle mouse hover over parent categories
  const handleMouseEnter = (parentId) => {
    setHoveredParent(parentId);
  };

  // Handle mouse leave from parent categories
  const handleMouseLeave = () => {
    setHoveredParent(null);
  };

  // Handle category selection, close dropdown after selection
  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
    console.log("Selected Category:", selectedCategory);
    setFieldValue('courseCategory', categoryName);
    setDropdownOpen(false); // Close the dropdown menu after selection
  };

  // Handle closing the dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    // Attach event listener for clicks outside the dropdown
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="relative inline-block w-1/2 text-left" ref={dropdownRef}>
      {/* Dropdown button */}
      <div>
        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="items-center inline-flex h-11 w-full justify-between rounded border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          {selectedCategory} {/* Display the selected category */}
          <DropDownArrow /> {/* Dropdown arrow icon */}
        </button>
      </div>

      {/* Dropdown menu */}
      {dropdownOpen && (
        <div className="absolute z-10 mt-2 w-full rounded-md bg-white shadow-lg">
          <ul className="py-1 text-sm text-gray-700">
            {parentCategories.map((parent) => (
              <li
                key={parent.id}
                className="relative cursor-pointer px-4 py-2 hover:bg-purple-100"
                onMouseEnter={() => handleMouseEnter(parent.id)}
                onMouseLeave={handleMouseLeave}
              >
                <span className="w-full flex justify-between" onClick={() => handleCategorySelect(parent.name)}>
                  {parent.name}
                  <RightArrow />
                </span>

                {/* Child categories */}
                {hoveredParent === parent.id && (
                  <ul className="absolute left-full top-0 w-48 rounded-md border bg-white shadow-lg">
                    {childCategories
                      .filter((child) => child.parent === parent.id)
                      .map((child) => (
                        <li
                          key={child.id}
                          className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                          onClick={() => handleCategorySelect(child.name)}
                        >
                          {child.name}
                        </li>
                      ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;
