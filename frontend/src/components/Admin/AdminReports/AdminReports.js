import React, { useEffect, useState } from "react";

import { getCourseProfitServices } from "../../../services/walletAndReportServices/walletServices";

const AdminReports = () => {
  const [courseProfits, setCourseProfits] = useState([]);

  useEffect(() => {
    const fetchCourseProfits = async () => {
      const fetchedCourseProfits = await getCourseProfitServices();
      if (fetchedCourseProfits) {
        setCourseProfits(fetchedCourseProfits);
      }
    };

    fetchCourseProfits();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="mb-4 text-2xl font-semibold">Course Profits</h2>
      <table className="min-w-full border border-gray-200 bg-white">
        <thead>
          <tr className="bg-gray-100 text-sm uppercase leading-normal text-gray-600">
            <th className="px-6 py-3 text-left">Course Title</th>
            <th className="px-6 py-3 text-left">Number of Purchases</th>
            <th className="px-6 py-3 text-left">Profit</th>
            <th className="px-6 py-3 text-left">Mentor Share</th>
          </tr>
        </thead>
        <tbody className="text-sm font-light text-gray-600">
          {courseProfits.map((courseProfit) => (
            <tr
              key={courseProfit.id}
              className="border-b border-gray-200 hover:bg-gray-100"
            >
              <td className="px-6 py-3">{courseProfit.course.title}</td>
              <td className="px-6 py-3">{courseProfit.number_of_purchases}</td>
              <td className="px-6 py-3">{courseProfit.admin_profit}</td>
              <td className="px-6 py-3">{courseProfit.mentor_profit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminReports;
