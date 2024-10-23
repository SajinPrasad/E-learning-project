import React, { useEffect, useState, useRef } from "react";
import { getCourseProfitServices } from "../../../services/walletAndReportServices/walletServices";
import { PrintIcon } from "../../common/Icons";
import CourseProfitsTableSkeleton from "../../Skeletons/CourseProfitsTableSkeleton";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const AdminReports = () => {
  const [courseProfits, setCourseProfits] = useState([]);
  const [isReportLoading, setIsReportLoading] = useState(true);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const reportRef = useRef(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    const fetchCourseProfits = async () => {
      const fetchedCourseProfits = await getCourseProfitServices();
      if (fetchedCourseProfits) {
        setCourseProfits(fetchedCourseProfits);
        setIsReportLoading(false);
      }
    };

    fetchCourseProfits();
  }, []);

  // Calculate total admin profit and mentor profit
  const totalAdminProfit = courseProfits.reduce(
    (acc, course) => acc + parseFloat(course.admin_profit || 0),
    0,
  );
  const totalMentorProfit = courseProfits.reduce(
    (acc, course) => acc + parseFloat(course.mentor_profit || 0),
    0,
  );

  // Get current date for the report
  const currentDate = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const generatePDF = async () => {
    setIsGeneratingPDF(true);

    // Wait for the state to update and DOM to re-render
    await new Promise((resolve) => setTimeout(resolve, 100));

    try {
      const input = reportRef.current;

      const canvas = await html2canvas(input, {
        scale: 2,
        logging: false,
        useCORS: true,
        windowWidth: input.scrollWidth,
        windowHeight: input.scrollHeight,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth() - 20;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 10, 10, pdfWidth, pdfHeight);

      // Open PDF in a new tab
      const pdfBlob = pdf.output("bloburl");
      window.open(pdfBlob);
    } catch (error) {
      console.error("PDF generation failed:", error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleFilterCourse = async () => {
    let fetchedCourseProfits;
    setIsReportLoading(true);

    if (startDate && endDate) {
      const formattedStartDate = startDate.toISOString().split("T")[0];
      const formattedEndDate = endDate.toISOString().split("T")[0];
      fetchedCourseProfits = await courseProfitDateFilter(
        formattedStartDate,
        formattedEndDate,
      );
    } else if (startDate) {
      const formattedStartDate = startDate.toISOString().split("T")[0];
      fetchedCourseProfits = await courseProfitDateFilter(formattedStartDate);
    } else if (endDate) {
      const formattedEndDate = endDate.toISOString().split("T")[0];
      fetchedCourseProfits = await courseProfitDateFilter(
        null,
        formattedEndDate,
      );
    }

    if (fetchedCourseProfits) {
      setCourseProfits(fetchedCourseProfits);
      setIsReportLoading(false);
    } else {
      setIsReportLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="mb-4 text-2xl font-semibold">Course Profits</h2>
      {isReportLoading ? (
        <CourseProfitsTableSkeleton role={"Admin"} />
      ) : (
        <>
          <div ref={reportRef} className="bg-white p-4">
            {/* PDF Header */}
            <div className={`mb-8 text-center ${!isGeneratingPDF && "hidden"}`}>
              <h1 className="text-4xl font-bold">BrainBridge</h1>
              <h2 className="mt-2 text-2xl font-semibold">
                Admin Sales Report
              </h2>
              <p className="mt-1 text-lg">{currentDate}</p>
            </div>

            <table className="min-w-full border border-gray-200">
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
                    <td className="px-6 py-3">
                      {courseProfit.number_of_purchases}
                    </td>
                    <td className="px-6 py-3">{courseProfit.admin_profit}</td>
                    <td className="px-6 py-3">{courseProfit.mentor_profit}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Total Profits Section */}
            <div className="mt-4">
              <div className="text-lg font-semibold">
                Total Admin Profit: ₹{totalAdminProfit.toFixed(2)}
              </div>
              <div className="text-lg font-semibold">
                Total Mentor Profit: ₹{totalMentorProfit.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Generate PDF Button */}
          <div className="ml-4 flex">
            <button
              onClick={generatePDF}
              className="flex items-center gap-2 rounded bg-theme-primary px-4 py-2 text-white transition duration-200 hover:bg-purple-700"
              disabled={isGeneratingPDF}
            >
              {isGeneratingPDF ? "Generating..." : "Generate PDF"}
              <PrintIcon />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminReports;
