import React, { useState } from "react";
import { SearchIcon } from "./Icons";

const SearchBar = ({ handleSearch }) => {
  const [searchKeyword, setSearchKeyword] = useState("");
  return (
    <div className="relative my-4 mb-3 ml-auto flex w-4/6 max-w-sm items-center">
      <input
        type="text"
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
        placeholder="Search..."
        className="w-full border-b-2 border-gray-300 px-4 py-2 pr-10 text-sm text-gray-700 outline-none focus:border-blue-500"
      />
      <span
        className="absolute bottom-2.5 right-3 cursor-pointer"
        onClick={() => handleSearch(searchKeyword)}
      >
        <SearchIcon />
      </span>
    </div>
  );
};

export default SearchBar;
