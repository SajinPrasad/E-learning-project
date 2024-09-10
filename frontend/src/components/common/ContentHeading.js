import React from "react";

/**
 * Common Heading component
 * @param {*} text - The text to display withing the heading
 * @returns
 */
const ContentHeading = ({ text }) => {
  return (
    <h5 className="text-blue-gray-900 text-md inline-block rounded-xl border border-gray-200 px-2 font-semibold sm:text-lg">
      {text}
    </h5>
  );
};

export default ContentHeading;
