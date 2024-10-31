import React from "react";

import { Footer, Header } from "../../common";
import AdminSidebar from "./AdminSidebar";

/**
 * The layout for admin panel. Header and sidebar are common.
 * @param {children} - Allthe child elemets will be rendered.
 * @returns
 */
const AdminLayout = ({ children }) => {
  return (
    <>
    <div className="flex h-screen flex-col">
      {/* Header with higher z-index */}
      <div className="sticky top-0 z-10 w-full">
        <Header />
      </div>
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar on the left */}
        <div className="hidden lg:block lg:w-1/5 flex-shrink-0">
          <AdminSidebar />
        </div>
        {/* Main content area */}
        <div className="flex-1 overflow-auto p-4">
          {children} {/* This is where the page-specific content will go */}
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default AdminLayout;
