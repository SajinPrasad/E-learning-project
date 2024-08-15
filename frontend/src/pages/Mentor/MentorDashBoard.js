import React from "react";

import { Header } from "../../components/common";
import MentorSidebar from "./MentorSidebar";
import MentorStats from "./MentorStats";

const MentorDashBoard = () => {
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
        {/* Stats on the right */}
        <div className="flex-1 overflow-auto p-4">
          <MentorStats />
        </div>
      </div>
    </div>
  );
};

export default MentorDashBoard;
