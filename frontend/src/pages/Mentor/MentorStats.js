import React from "react";
import { DownwardArrow, UpwardArrow } from "../../components/common/Icons";

const MentorStats = () => {
  return (
    <div className={`mt-6 flex flex-col justify-evenly gap-1 p-4 sm:flex-row`}>
      <article
        className={`rounded-lg border border-gray-100 bg-gray-50 p-6 shadow-md`}
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
        className={`rounded-lg border border-gray-100 bg-gray-50 p-6 shadow-md`}
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
        className={`rounded-lg border border-gray-100 bg-gray-50 p-6 shadow-md`}
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
