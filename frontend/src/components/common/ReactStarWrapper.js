import React from "react";
import ReactStars from "react-rating-stars-component";

const ReactStarsWrapper = ({
  count = 5,
  size = 34,
  value = 0,
  edit = true,
  isHalf = true,
  emptyIcon = <i className="far fa-star"></i>,
  halfIcon = <i className="fa fa-star-half-alt"></i>,
  fullIcon = <i className="fa fa-star"></i>,
  activeColor = "#fac400",
  onChange = () => {},
  ...props
}) => {
  return (
    <ReactStars
      count={count}
      size={size}
      value={value}
      edit={edit}
      isHalf={isHalf}
      emptyIcon={emptyIcon}
      halfIcon={halfIcon}
      fullIcon={fullIcon}
      activeColor={activeColor}
      onChange={onChange}
      {...props}
    />
  );
};

export default ReactStarsWrapper;
