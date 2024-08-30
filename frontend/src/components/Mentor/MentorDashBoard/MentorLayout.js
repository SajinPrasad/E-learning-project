import React from "react";

import { Header } from "../../common";
import MentorSidebar from "./MentorSidebar";

/**
 * The layout for Mentor. Header and sidebar are common.
 * @param {children} - Allthe child elemets will be rendered.
 * @returns
 */
const MentorLayout = ({ children }) => {
  return (
    <div className="flex h-screen flex-col">
      {/* Header with higher z-index */}
      <div className="sticky top-0 z-10 w-full">
        <Header />
      </div>
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar on the left */}
        <div className="w-1/5 flex-shrink-0">
          <MentorSidebar />
        </div>
        {/* Main content area */}
        <div className="flex-1 overflow-auto p-4">
          {children} {/* This is where the page-specific content will go */}
        </div>
      </div>
    </div>
  );
};

export default MentorLayout;
