import React from "react";

const FieldError = ({text}) => {
    console.log(text)
  return (
    <>
      <p className="text-sm text-red-500">{text}</p>
    </>
  );
};

export default FieldError;
