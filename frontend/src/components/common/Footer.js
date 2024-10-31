import React from "react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-gray-900 py-8 text-white">
      <div className="container mx-auto grid grid-cols-1 gap-8 px-4 md:grid-cols-3">
        {/* Company Info */}
        <div>
          <h3 className="mb-4 text-2xl font-semibold text-theme-primary">
            BrainBridge
          </h3>
          <p className="mb-4 text-gray-400">
            Discover a world of knowledge with interactive courses and real-time
            collaboration.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-theme-primary">
              Facebook
            </a>
            <a href="#" className="text-gray-400 hover:text-theme-primary">
              Twitter
            </a>
            <a href="#" className="text-gray-400 hover:text-theme-primary">
              LinkedIn
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="mb-4 text-xl font-semibold text-theme-primary">
            Quick Links
          </h4>
          <ul className="space-y-2">
            <li>
              <a
                href="/"
                className="cursor-pointer text-gray-400 hover:text-theme-primary"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="/courses"
                className=" text-gray-400 hover:text-theme-primary"
              >
                Courses
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-400 hover:text-theme-primary">
                Categories
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-400 hover:text-theme-primary">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-400 hover:text-theme-primary">
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter Subscription */}
        <div>
          <h4 className="mb-4 text-xl font-semibold text-theme-primary">
            Stay Updated
          </h4>
          <p className="mb-4 text-gray-400">
            Subscribe to our newsletter for the latest courses and updates.
          </p>
          <form className="flex items-center space-x-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-md p-2 text-gray-900 focus:outline-none"
            />
            <button className="hover:bg-theme-primary-dark rounded-md bg-theme-primary px-4 py-2 text-white">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-8 border-t border-gray-700 pt-4 text-center">
        <p className="text-gray-500">
          &copy; 2024 BrainBridge. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
