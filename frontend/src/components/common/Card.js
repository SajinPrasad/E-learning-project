import React from "react";

import Button from "./Button";
import { DeleteIcon } from "./Icons";

const Card = ({ id, title, description, onDelete, subText }) => {
  return (
    <>
      <section
        className={`grid h-1/4 p-3 sm:w-2/3 sm:min-w-[300px] md:w-[39%] lg:w-[33%]`}
      >
        <div
          className={`flex h-[270px] w-auto max-w-[24rem] flex-col rounded-lg bg-white shadow-md`}
        >
          <div className={`border-b p-4`}>
            <div className={`flex w-full justify-between`}>
              {subText ? (
                <p className={`text-xs font-medium text-gray-400`}>{subText}</p>
              ) : null}
              <span onClick={() => onDelete(id)} className="cursor-pointer">
                <DeleteIcon />
              </span>
            </div>
            <h2
              className={`text-blue-gray-800 mb-2 mt-1 text-[18px] font-bold`}
            >
              {title}
            </h2>
          </div>
          <div className={`flex-1 overflow-hidden p-4`}>
            <p
              className={`line-clamp-3 overflow-hidden font-normal text-gray-600`}
            >
              {description}
            </p>
          </div>
          <div className={`p-4`}>
            <Button text={`View more`} />
          </div>
        </div>
      </section>
    </>
  );
};

export default Card;
