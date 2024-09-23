import React from "react";

/**
 * Banner component
 */
const Banner = () => {
  return (
    <>
      <section className={`bg-white px-2 py-12 md:px-0`}>
        <div
          className={`container mx-auto max-w-6xl items-center px-8 xl:px-5`}
        >
          <div className={`flex flex-wrap items-center sm:-mx-3`}>
            <div className={`w-full md:w-2/4 md:px-3`}>
              <div
                className={`w-full space-y-6 pb-6 sm:max-w-md sm:pr-5 md:space-y-4 md:pb-0 lg:max-w-lg lg:space-y-8 lg:pr-0 xl:space-y-9`}
              >
                <h1
                  className={`text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-4xl lg:text-5xl xl:text-6xl`}
                >
                  <span className={`block xl:inline`}>Tools You Need </span>
                  <span className={`block text-theme-primary xl:inline`}>
                    to Build Better, Faster.
                  </span>
                </h1>
                <p
                  className={`mx-auto text-base text-gray-500 sm:max-w-md md:max-w-3xl lg:text-xl`}
                >
                  Discover a world of knowledge with our interactive courses and
                  real-time collaboration tools.
                </p>
                <div
                  className={`relative flex flex-col sm:flex-row sm:space-x-4`}
                >
                  <a
                    href="#_"
                    className={`mb-3 flex w-full items-center rounded-md border-2 bg-theme-primary px-6 py-3 text-lg text-white hover:border-theme-primary hover:bg-white hover:text-black sm:mb-0 sm:w-auto`}
                  >
                    Explore Courses
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`ml-1 h-5 w-5`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </a>
                  <a
                    href="#_"
                    className={`flex items-center rounded-md bg-gray-100 px-6 py-3 text-gray-500 hover:bg-gray-200 hover:text-gray-600`}
                  >
                    Learn More
                  </a>
                </div>
              </div>
            </div>
            <div className={`w-full md:w-1/2`}>
              <div
                className={`h-auto w-full overflow-hidden rounded-md shadow-xl sm:rounded-xl`}
              >
                <img
                  src="https://images.unsplash.com/photo-1498049860654-af1a5c566876?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
                  alt="Tool Display"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Banner;
