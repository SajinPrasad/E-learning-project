import React from "react";

const Button = ({ text, bg = true }) => {
  return (
    <div>
      <div class="flex gap-4">
        <a
          className={`min-w-[120px] rounded border-2 border-theme-primary ${bg ? "bg-theme-primary text-white" : "bg-white text-black"} hover:border-theme-primary hover:bg-white hover:text-black  py-1 text-center hover:bg-transparent focus:outline-none focus:ring`}
        >
          {text}
        </a>
      </div>
    </div>
  );
};

export default Button;
