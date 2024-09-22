import React from "react";

const Button = ({ text, bg = true }) => {
  return (
    <div className={`flex cursor-pointer gap-4`}>
      <button
        className={`flex min-w-[110px] items-center justify-center rounded border-2 border-theme-primary px-3 md:min-w-[130px] ${bg ? "bg-theme-primary text-white hover:bg-purple-700" : "bg-white text-black hover:bg-purple-200"} py-2 hover:border-theme-primary focus:outline-none`}
      >
        {text}
      </button>
    </div>
  );
};

export default Button;
