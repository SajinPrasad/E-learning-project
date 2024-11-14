import React, { useState } from "react";
import Swal from "sweetalert2";

import Button from "./Button";
import { CloseIcon } from "./Icons";
import { styles } from "../common";
import { updateCategory } from "../../services/courseServices/categoryService";

async function showConfirmCategoryStatusAlert(status) {
  return Swal.fire({
    title: "Are you sure?",
    text: `You are ${status ? "Enabling" : "Disabling"} the category!`,
    icon: "warning",
    showConfirmButton: true,
    showCancelButton: true,
    confirmButtonText: `Confirm`,
    cancelButtonText: "Cancel",
    background: "#fffff",
    customClass: {
      title: "text-black",
      popup: "my-popup-class",
      confirmButton: `${styles.confirmbutton}`,
      cancelButton: `${styles.cancelbutton}`,
    },
  }).then((result) => result.isConfirmed);
}

{/* Card for categories. */}
const Card = ({
  id,
  title,
  description,
  isActive: initialActiveStatus,
  subText,
  btn = false,
  subCategories = [],
}) => {
  const [iscSubcatPopupOpen, setIsSubcatPopupOpen] = useState(false);
  const [isActive, setIsActive] = useState(initialActiveStatus);

  const handleOpenPopup = () => {
    setIsSubcatPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsSubcatPopupOpen(false);
  };

  const handleEnableDisableCategory = async () => {
    const newStatus = !isActive;
    const confirmed = await showConfirmCategoryStatusAlert(newStatus);
    if (confirmed) {
      const props = {
        categoryId: id,
        field: "is_active",
        value: newStatus,
        url:
          subText === "Parent Category" ? "parent-categories" : "subcategories",
      };
      const response = await updateCategory(props);
      if (response) {
        setIsActive(newStatus);
      }
    }
  };

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
              <p
                onClick={handleEnableDisableCategory}
                className="cursor-pointer rounded p-1 text-xs text-gray-600 hover:bg-gray-200"
              >
                {isActive ? "Disable" : "Enable"}
              </p>
            </div>
            <h2
              className={`text-blue-gray-800 mb-2 mt-1 text-[18px] font-bold`}
            >
              {title}
            </h2>
            {!isActive && (
              <p className="text-xs font-semibold text-red-500">Disabled</p>
            )}
          </div>
          <div className={`flex-1 overflow-hidden p-4`}>
            <p
              className={`line-clamp-3 overflow-hidden font-normal text-gray-600`}
            >
              {description}
            </p>
          </div>
          {btn && (
            <div onClick={handleOpenPopup} className={`p-4`}>
              <Button text={`View Subcategories`} />
            </div>
          )}
        </div>
      </section>

      {iscSubcatPopupOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black bg-opacity-50 md:justify-end md:pr-20">
          <div className="relative w-5/6 rounded bg-white p-5 shadow-lg md:w-4/6">
            {/* Close button positioned in the top-right corner */}
            <button
              className="absolute right-4 top-4"
              onClick={handleClosePopup}
            >
              <CloseIcon />
            </button>
            <div>
              <h3 className="text-md font-semibold">
                Sub categories of {title}
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {subCategories && (
                <>
                  {subCategories.map((category) => (
                    <Card
                      id={category.id}
                      title={category.name}
                      description={category.description}
                      key={category.name}
                      subText={`${title} > ${category.name}`}
                      isActive={category.is_active}
                    />
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Card;
