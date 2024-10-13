import React from "react";

const PaypalButtonSkeleton = () => {
  return (
    <div className="w-full max-w-md">
      {/* PayPal button skeleton */}
      <div className="mb-4 flex h-12 animate-pulse items-center justify-center rounded-md bg-yellow-300">
        <div className="h-6 w-24 rounded bg-yellow-400"></div>
      </div>

      {/* "Debit or Credit Card" button skeleton */}
      <div className="flex h-12 animate-pulse items-center justify-center rounded-md bg-gray-200">
        <div className="h-6 w-40 rounded bg-gray-300"></div>
      </div>

      {/* "Powered by PayPal" text skeleton */}
      <div className="mt-2 flex justify-end">
        <div className="h-4 w-32 animate-pulse rounded bg-gray-200"></div>
      </div>
    </div>
  );
};

export default PaypalButtonSkeleton;
