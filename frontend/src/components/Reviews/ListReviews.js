import React, { useEffect, useState } from "react";

import { getReviewListService } from "../../services/courseServices/reviewService";
import ReviewCard from "./ReviewCard";
import { ReviewCardSkeleton } from "../Skeletons";

/**
 * @param {number} courseId - Colurse id to fetch the reviews
 * @returns Component which renders review cards with fetched reviews
 */
const ListReviews = ({ courseId }) => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        const fetchedReviews = await getReviewListService(courseId);
        setReviews(fetchedReviews);
      } catch (err) {
        setError("Failed to fetch reviews. Please try again later.");
        console.error("Error fetching reviews");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [courseId]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {Array(4)
          .fill()
          .map((_, index) => (
            <ReviewCardSkeleton key={index} />
          ))}
      </div>
    );
  }
  if (error) return <div>{error}</div>;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
};

export default ListReviews;
