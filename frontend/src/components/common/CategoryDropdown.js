import React, { useState, useEffect, useRef } from "react";

import { DropDownArrow, RightArrow } from "./Icons";
import {
  getParentCategories,
  getSubCategories,
} from "../../services/courseServices/categoryService";

const CategoryDropdown = ({
  isOpen = false,
  header = false,
  error = false,
  selectedCategory,
  setSelectedCategory,
  setFieldValue,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(isOpen);
  const [hoveredParent, setHoveredParent] = useState(null);
  const dropdownRef = useRef(null);

  const [parentCategories, setParentCategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);

  const handleMouseEnter = (parentId) => {
    setHoveredParent(parentId);
  };

  const handleMouseLeave = () => {
    setHoveredParent(null);
  };

  const handleCategorySelect = (categoryName) => {
    if (setSelectedCategory) setSelectedCategory(categoryName);
    if (setFieldValue) setFieldValue("courseCategory", categoryName);
    setDropdownOpen(false);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const fetchedParentCategories = await getParentCategories();
      const fetchedSubCategories = await getSubCategories();

      setParentCategories(fetchedParentCategories);
      setChildCategories(fetchedSubCategories);
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    setDropdownOpen(isOpen);
  }, [isOpen]);

  const buttonStyles = header
    ? "text-gray-600 hover:text-gray-900"
    : `${error ? 'border-red-500' : 'border-gray-200'} h-11 py-2 rounded border hover:bg-gray-50 bg-white px-4`;

  return (
    <div
      className={`relative ${header ? "inline-block" : "inline-block w-1/2"} text-left`}
      ref={dropdownRef}
    >
      {!header && (
        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className={`inline-flex w-full items-center justify-between ${buttonStyles} text-sm font-medium text-gray-700`}
        >
          {selectedCategory}
          <DropDownArrow />
        </button>
      )}

      {dropdownOpen && (
        <div
          className={`${
            header
              ? "absolute left-0 top-full mt-1 w-64" // Adjusted wider width for header
              : "absolute z-10 mt-2 w-full"
          } rounded-md bg-white shadow-lg`}
        >
          <ul className="py-1 text-sm text-gray-700">
            {parentCategories?.map((parent) => (
              <li
                key={parent.id}
                className="relative cursor-pointer px-4 py-2 hover:bg-purple-100"
                onMouseEnter={() => handleMouseEnter(parent.id)}
                onMouseLeave={handleMouseLeave}
                
              >
                <span onClick={() => handleCategorySelect(parent.name)} className="flex w-full justify-between">
                  {parent.name}
                  <RightArrow />
                </span>

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
