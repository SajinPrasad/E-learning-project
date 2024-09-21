import React, { useEffect, useState } from "react";

import { Header } from "../../components/common";
import FullCourseView from "../../components/Course/FullCourseView";

const FullCoursePage = () => {
  const [showHeader, setShowHeader] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowHeader(window.scrollY > 100);
    };

    const handleMouseMove = (e) => {
      setShowHeader(e.clientY < 100);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <>
      <div
        className={`fixed z-10 top-0 left-0 w-full transition-transform duration-700 ease-in-out ${showHeader ? "transform translate-y-0" : "transform -translate-y-full"} header`}
      >
        <Header />
      </div>

      {/* Full course view */}
      <div > {/* Adjust margin-top based on header height */}
        <FullCourseView />
      </div>
    </>
  );
};
export default FullCoursePage;
