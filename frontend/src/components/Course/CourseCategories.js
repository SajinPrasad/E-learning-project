import React, { useEffect, useState } from "react";

import { Card, Loading } from "../common";
import { getParentCategories } from "../../services/courseServices/categoryService";
import { PlusIcon } from "../common/Icons";
import CourseCategoryForm from "./CourseCategoryForm";
import { AdminLayout } from "../Admin";
import { setCategoryData } from "../../features/course/categorySlice";

const CourseCategories = () => {
  // State to hold categories data
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isCategoryForm, setIsCategoryForm] = useState(); // State to show category form

  // useEffect hook to fetch categories data on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      const categoriesData = await getParentCategories(setIsLoading);
      if (categoriesData) {
        setCategories(categoriesData);
      }
      setIsLoading(false);
    };

    fetchCategories();
  }, []); // Empty dependency array to ensure the effect runs only once after initial render

  // Function to refresh categories data
  const refreshCategories = async () => {
    const categoriesData = await getParentCategories();
    if (categoriesData) {
      setCategories(categoriesData);
      setCategoryData(categoriesData); //Setting redux state for categories
    }
  };

  const handleIsCategoryForm = () => {
    setIsCategoryForm((prev) => !prev);
  };

  return (
    <AdminLayout>
      {isLoading && <Loading />}
      <div className={`ml-2 flex-1 justify-center overflow-auto md:ml-0`}>
        {/* Section for title and action button */}
        <div className={`m-4`}>
          <h5
            className={`text-blue-gray-900 text-xl font-semibold sm:text-2xl`}
          >
            Course Categories
          </h5>
          <p className={`mt-1 text-xs font-normal text-gray-600 md:text-sm`}>
            Click view more to see the subcategories.
          </p>
          {/* Navigate to the category creation page */}
          <div
            onClick={handleIsCategoryForm}
            className={`mt-1 inline-flex cursor-pointer items-center gap-1 text-xs font-bold text-gray-500 hover:text-theme-primary md:text-sm`}
            style={{ maxWidth: "fit-content" }}
          >
            {isCategoryForm ? "Hide Category Form" : "Add new Category"}
            {!isCategoryForm && (
              <span className="ml-1">
                <PlusIcon />
              </span>
            )}
          </div>
          {isCategoryForm && (
            <CourseCategoryForm
              categories={categories}
              setIsCategoryForm={setIsCategoryForm}
              refreshCategories={refreshCategories}
            />
          )}
        </div>
        {/* Container for rendering category cards */}
        <div className={`relative z-0 flex flex-wrap gap-1`}>
          {categories.map((category) => (
            <Card
              id={category.id}
              title={category.name}
              description={category.description}
              key={category.name}
              subText={`Parent Category`}
              btn={true}
              isActive={category.is_active}
              subCategories={category.sub_categories}
            />
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default CourseCategories;
