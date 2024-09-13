import React, { useState } from "react";
import { Button } from "../common";

const CourseStatusChange = ({ isOpen, onClose, onSubmit, currentStatus }) => {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(selectedStatus); // Pass the selected status to the parent component
  };

  if (!isOpen) return null; // Do not render if modal is not open

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-80 rounded bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-lg font-bold">Change Course Status</h3>
        <>
          <label htmlFor="status" className="block text-sm font-medium">
            Select Status:
          </label>
          <select
            id="status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="mt-2 block w-full rounded border border-gray-300 p-2"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <div className="mt-4 flex justify-end space-x-2">
            <div onClick={onClose}>
              <Button text={"Cancel"} bg={false} />
            </div>
            <div onClick={handleSubmit}>
              <Button text={"Submit"} />
            </div>
          </div>
        </>
      </div>
    </div>
  );
};

export default CourseStatusChange;
