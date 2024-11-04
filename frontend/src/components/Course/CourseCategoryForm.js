import React, { useState } from "react";

import { Button } from "../common";
import {
  createParentCategories,
  createSubCategory,
} from "../../services/courseServices/categoryService";

/**
 * Renders the Category form to add New categories.
 * @param {setIsCategoryForm} - Function to change the state of category form
 *                              visibility after submit
 * @returns
 */
const CourseCategoryForm = ({
  categories,
  setIsCategoryForm,
  refreshCategories,
}) => {
  const [name, setName] = useState();
  const [description, setDescription] = useState();
  const [parentCategoryID, setparentCategoryID] = useState("Parent");

  const handleSubmission = async (e) => {
    e.preventDefault();
    try {
      if (parentCategoryID === "Parent") {
        await createParentCategories(name, description);
      } else {
        await createSubCategory(name, description, parentCategoryID);
      }
      refreshCategories();
      setIsCategoryForm(false); // Hiding the category form
    } catch (error) {
      console.log("Error while creating category");
    }
  };

  return (
    <div className="flex w-5/6 flex-col shadow">
      <div className="ml-2 flex-1 justify-center overflow-auto md:ml-0">
        <section className="container mx-auto px-2 py-10 md:px-4 lg:px-6">
          <h5 className="text-blue-gray-900 text-2xl font-semibold">
            Create new Category
          </h5>
          <p className="mt-1 text-sm font-normal text-gray-600">
            Create a new category with appropriate description.
          </p>
          <form className="mt-8 flex flex-col">
            <div className="mb-6 flex flex-col items-start gap-4">
              <div className={`flex w-full gap-3`}>
                <div className="w-1/2">
                  <label className="text-blue-gray-900 mb-2 text-sm font-medium">
                    Category Name
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    placeholder="Programming"
                    className="border-t-blue-gray-200 w-full rounded border p-3 text-sm placeholder-opacity-100 focus:border-theme-primary focus:outline-none"
                  />
                </div>
                <div className="w-1/2">
                  <label className="text-blue-gray-900 mb-2 text-sm font-medium">
                    Add as Sub Category{" "}
                    <i className={`text-xs text-gray-500`}>
                      (Default Parent category)
                    </i>
                  </label>
                  <select
                    onChange={(e) => setparentCategoryID(e.target.value)}
                    className={`border-t-blue-gray-200 w-full rounded border bg-white p-3 text-sm placeholder-opacity-100 focus:border-theme-primary focus:outline-none`}
                  >
                    <option>Parent</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="w-full">
                <label className="text-blue-gray-900 mb-2 text-sm font-medium">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="A category which contains courses for learning basics of..."
                  className="border-t-blue-gray-200 h-36 w-full resize-none overflow-auto rounded border p-3 text-sm placeholder-opacity-100 focus:border-theme-primary focus:outline-none"
                />
              </div>
            </div>
            <span className={`m-auto`} onClick={(e) => handleSubmission(e)}>
              <Button text={"Submit"} />
            </span>
          </form>
        </section>
      </div>
    </div>
  );
};

export default CourseCategoryForm;
