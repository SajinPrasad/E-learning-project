import React from "react";

const CartSkeleton = () => {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="mb-6 text-2xl font-bold md:text-3xl">Shopping Cart</h1>

      {/* Grid Container */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Courses and Saved for Later (Spanning 2 columns on larger screens) */}
        <div className="lg:col-span-2">
          {/* Courses in Cart Skeleton */}
          <div className="mb-8">
            <div className="mb-4 h-6 w-40 animate-pulse rounded bg-gray-300"></div>

            {[...Array(2)].map((_, index) => (
              <div
                key={index}
                className="mb-4 flex animate-pulse flex-col items-start justify-between rounded bg-white p-4 shadow-md md:flex-row"
              >
                <div className="mb-4 h-24 w-24 rounded bg-gray-300 md:mb-0 md:h-32 md:w-32"></div>
                <div className="flex-1 md:ml-4">
                  <div className="mb-2 h-5 w-2/3 rounded bg-gray-300"></div>
                  <div className="mb-2 h-4 w-1/3 rounded bg-gray-300"></div>
                  <div className="my-2 h-4 w-20 rounded bg-yellow-400"></div>
                  <div className="mb-2 h-4 w-1/2 rounded bg-gray-300"></div>
                  <div className="mb-2 h-4 w-1/3 rounded bg-gray-300"></div>
                  <div className="mt-2 flex space-x-4">
                    <div className="h-4 w-16 rounded bg-gray-300"></div>
                    <div className="h-4 w-20 rounded bg-gray-300"></div>
                    <div className="h-4 w-24 rounded bg-gray-300"></div>
                  </div>
                </div>
                <div className="mt-4 h-6 w-16 rounded bg-gray-300 md:mt-0"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary and Promotions (Spanning 1 column on larger screens) */}
        <div className="animate-pulse self-start rounded bg-white p-4 shadow-md md:p-8">
          <div className="mb-4 h-5 w-1/2 rounded bg-gray-300"></div>
          <div className="h-10 w-full rounded bg-purple-300"></div>
        </div>
      </div>
    </div>
  );
};

export default CartSkeleton;
