import React from "react";
import { DownwardArrow, UpwardArrow } from "../../../components/common/Icons";

const MentorStats = () => {
  return (
    <div
      className={`mt-6 flex flex-col justify-evenly gap-1 p-4 sm:flex-row sm:flex-wrap sm:justify-start md:grid md:grid-cols-2 lg:grid-cols-4`}
    >
      <article
        className={`mb-4 w-full rounded-lg border border-gray-100 bg-gray-50 p-6 shadow-md sm:w-[calc(95%-1rem)]`}
      >
        <div>
          <p className={`text-sm text-gray-500`}>Profit</p>
          <p className={`text-2xl font-medium text-gray-900`}>$240.94</p>
        </div>

        <div className={`mt-1 flex gap-1 text-green-600`}>
          <UpwardArrow />
          <p className={`flex gap-2 text-xs`}>
            <span className={`font-medium`}> 67.81% </span>
            <span className={`text-gray-500`}> Since last week </span>
          </p>
        </div>
      </article>

      <article
        className={`mb-4 w-full rounded-lg border border-gray-100 bg-gray-50 p-6 shadow-md sm:w-[calc(95%-1rem)]`}
      >
        <div>
          <p className={`text-sm text-gray-500`}>Profit</p>
          <p className={`text-2xl font-medium text-gray-900`}>$240.94</p>
        </div>

        <div className={`mt-1 flex gap-1 text-red-600`}>
          <DownwardArrow />
          <p className={`flex gap-2 text-xs`}>
            <span className={`font-medium`}> 67.81% </span>
            <span className={`text-gray-500`}> Since last week </span>
          </p>
        </div>
      </article>

      <article
        className={`mb-4 w-full rounded-lg border border-gray-100 bg-gray-50 p-6 shadow-md sm:w-[calc(95%-1rem)]`}
      >
        <div>
          <p className={`text-sm text-gray-500`}>Profit</p>
          <p className={`text-2xl font-medium text-gray-900`}>$240.94</p>
        </div>

        <div className={`mt-1 flex gap-1 text-red-600`}>
          <DownwardArrow />
          <p className={`flex gap-2 text-xs`}>
            <span className={`font-medium`}> 67.81% </span>
            <span className={`text-gray-500`}> Since last week </span>
          </p>
        </div>
      </article>

      {/* Additional article */}
      <article
        className={`mb-4 w-full rounded-lg border border-gray-100 bg-gray-50 p-6 shadow-md sm:w-[calc(95%-1rem)]`}
      >
        <div>
          <p className={`text-sm text-gray-500`}>Profit</p>
          <p className={`text-2xl font-medium text-gray-900`}>$240.94</p>
        </div>

        <div className={`mt-1 flex gap-1 text-red-600`}>
          <DownwardArrow />
          <p className={`flex gap-2 text-xs`}>
            <span className={`font-medium`}> 67.81% </span>
            <span className={`text-gray-500`}> Since last week </span>
          </p>
        </div>
      </article>
    </div>
  );
};

export default MentorStats;