import React, { useEffect, useState } from "react";

import { getCourseProfitServices } from "../../../services/walletAndReportServices/walletServices";

const MentorReports = () => {
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
      <h2 className="text-2xl font-semibold mb-4">Course Profits</h2>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Course Title</th>
            <th className="py-3 px-6 text-left">Number of Purchases</th>
            <th className="py-3 px-6 text-left">Profit</th>
            <th className="py-3 px-6 text-left">Admin Share</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {courseProfits.map((courseProfit) => (
            <tr key={courseProfit.id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6">{courseProfit.course.title}</td>
              <td className="py-3 px-6">{courseProfit.number_of_purchases}</td>
              <td className="py-3 px-6">{courseProfit.mentor_profit}</td>
              <td className="py-3 px-6">{courseProfit.admin_profit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MentorReports;
