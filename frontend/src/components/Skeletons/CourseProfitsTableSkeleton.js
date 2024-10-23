import React from "react";

const CourseProfitsTableSkeleton = ({ role }) => {
  return (
    <div className="w-full animate-pulse">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-sm uppercase leading-normal text-gray-600">
            <th className="px-6 py-3 text-left">Course Title</th>
            <th className="px-6 py-3 text-left">Number of Purchases</th>
            <th className="px-6 py-3 text-left">Profit</th>
            <th className="px-6 py-3 text-left">
              {role === "Admin" ? "Mentor" : "Admin"} Share
            </th>
          </tr>
        </thead>
        <tbody>
          {[...Array(5)].map((_, index) => (
            <tr key={index} className="border-b">
              <td className="p-4">
                <div className="h-4 w-48 rounded bg-gray-200"></div>
              </td>
              <td className="p-4">
                <div className="mx-auto h-4 w-16 rounded bg-gray-200"></div>
              </td>
              <td className="p-4">
                <div className="mx-auto h-4 w-20 rounded bg-gray-200"></div>
              </td>
              <td className="p-4">
                <div className="mx-auto h-4 w-20 rounded bg-gray-200"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Summary Section */}
      <div className="mt-4 flex items-center justify-between border-t pt-4">
        <div className="space-y-2">
          <div className="h-6 w-48 rounded bg-gray-200"></div>
          <div className="h-6 w-44 rounded bg-gray-200"></div>
        </div>
        <div className="h-10 w-32 rounded bg-gray-200"></div>
      </div>
    </div>
  );
};

export default CourseProfitsTableSkeleton;
