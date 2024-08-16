import React from "react";

import { Header } from "../../../components/common";
import AdminSidebar from "../AdminDashBoard/AdminSidebar";

const CourseCategoryForm = () => {
  return (
    <div className="flex h-screen flex-col">
      {/* Header with higher z-index */}
      <div className="sticky top-0 z-10 w-full">
        <Header />
      </div>
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar on the left */}
        <div className="w-1/5 flex-shrink-0">
          <AdminSidebar />
        </div>
        {/* Stats on the right */}
        <div className="flex-1 overflow-auto">
          <section className="container mx-auto px-8 py-10">
            <h5 className="text-blue-gray-900 text-2xl font-semibold">
              Create new Category
            </h5>
            <p className="mt-1 text-sm font-normal text-gray-600">
              Create a new category with appropriate description.
            </p>
            <div className="mt-8 flex flex-col">
              <div className="mb-6 flex flex-col items-end gap-4">
                <div className="w-full">
                  <label className="text-blue-gray-900 mb-2 text-sm font-medium">
                    Category Name
                  </label>
                  <input
                    type="text"
                    placeholder="Programming"
                    className="border-t-blue-gray-200 w-full rounded border p-3 text-sm placeholder-opacity-100 focus:border-theme-primary focus:outline-none"
                  />
                </div>
                <div className="w-full">
                  <label className="text-blue-gray-900 mb-2 text-sm font-medium">
                    Description
                  </label>
                  <input
                    type="text"
                    placeholder="A category which contains courses for learning basics of..."
                    className="border-t-blue-gray-200 h-32 w-full rounded border p-3 text-sm placeholder-opacity-100 focus:border-theme-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CourseCategoryForm;
