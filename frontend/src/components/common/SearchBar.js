import React, { useState } from "react";

import { SearchIcon } from "./Icons";

const SearchBar = ({ setSearchTerm }) => {
  const [textEntered, setTextEntered] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(textEntered);
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-md">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <div className="relative">
        <button type="submit" className="absolute inset-y-0 left-0 flex cursor-pointer items-center pl-3">
          <SearchIcon />
        </button>
        <input
          type="search"
          id="search"
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
          placeholder="Search"
          value={textEntered}
          onChange={(e) => setTextEntered(e.target.value)}
          required
        />
      </div>
    </form>
  );
};

export default SearchBar;
