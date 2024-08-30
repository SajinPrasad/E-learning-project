import React from "react";

const Button = ({ text, bg = true}) => {
  return (
    <div className={`flex cursor-pointer gap-4`}>
      <button
        className={`flex min-w-[110px] items-center justify-center rounded border-2 border-theme-primary md:min-w-[130px] ${bg ? "bg-theme-primary text-white hover:bg-white hover:text-black" : "bg-white text-black hover:bg-theme-primary hover:text-white"} py-1 hover:border-theme-primary focus:outline-none`}
      >
        {text}
      </button>
    </div>
  );
};

export default Button;