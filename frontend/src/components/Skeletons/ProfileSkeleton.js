import React from "react";

const ProfileSkeleton = () => {
  return (
    <section className="container mx-auto animate-pulse px-8 py-20">
      <div className="text-center md:text-start">
        <h5 className="text-blue-gray-800 text-2xl">Basic Information</h5>
        <p className="mt-1 text-sm text-gray-600">
          Update your profile information below.
        </p>
      </div>

      {/* Profile picture skeleton */}
      <div className="mb-6 mt-8 flex flex-col items-center">
        <div className="h-32 w-32 rounded-full bg-gray-200"></div>
        <div className="mt-2 h-6 w-16 rounded bg-gray-200"></div>
      </div>

      {/* Form fields skeleton */}
      <div className="mt-8 flex flex-col">
        <div className="mb-6 flex flex-col items-end gap-4 md:flex-row">
          {[1, 2].map((i) => (
            <div key={i} className="w-full">
              <div className="mb-2 h-4 w-24 rounded bg-gray-200"></div>
              <div className="h-10 w-full rounded bg-gray-200"></div>
            </div>
          ))}
        </div>

        <div className="mb-6 flex flex-col gap-4 md:flex-row">
          {[1, 2].map((i) => (
            <div key={i} className="w-full">
              <div className="mb-2 h-4 w-24 rounded bg-gray-200"></div>
              <div className="h-10 w-full rounded bg-gray-200"></div>
            </div>
          ))}
        </div>

        <div className="mb-6 flex flex-col items-end gap-4 md:flex-row">
          {[1, 2].map((i) => (
            <div key={i} className="w-full">
              <div className="mb-2 h-4 w-24 rounded bg-gray-200"></div>
              <div className="h-10 w-full rounded bg-gray-200"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProfileSkeleton;
