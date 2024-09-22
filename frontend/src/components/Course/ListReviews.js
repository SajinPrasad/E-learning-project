import React, { useEffect, useState } from "react";

import { getReviewListService } from "../../services/courseServices/reviewService";
import ReviewCard from "./ReviewCard";

const ListReviews = ({ courseId }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const fetchedReviews = await getReviewListService(courseId);
      setReviews(fetchedReviews);
    };

    fetchReviews();
  }, [courseId]);
  console.log(reviews);
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
};

export default ListReviews;
