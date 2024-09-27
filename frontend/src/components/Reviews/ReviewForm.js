import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import {
  createReviewService,
  getOwnersReviewService,
  updateReviewService,
} from "../../services/courseServices/reviewService";
import { Button, ReactStarsWrapper } from "../common";
import { EditIcon } from "../common/Icons";

// Validation schema using Yup
const reviewSchema = Yup.object({
  reviewRating: Yup.number()
    .required("Rating is required.")
    .min(0.5, "Rating must be at least 0.5.")
    .max(5, "Rating cannot be more than 5."),
  reviewText: Yup.string()
    .min(5, "Review must be at least 5 characters.")
    .required("Review text is required."),
});

const ReviewForm = ({ courseId, setReviewUpdated }) => {
  const [review, setReview] = useState(null); // Store user's review
  const [isEditing, setIsEditing] = useState(false); // Toggle between view and edit mode
  const [isExpanded, setIsExpanded] = useState(false);

  // Function to truncate the text to 75 words
  const getTruncatedText = (text) => {
    return text.split(" ").slice(0, 75).join(" ");
  };

  useEffect(() => {
    const fetchOwnersReview = async () => {
      const fetchedReview = await getOwnersReviewService(courseId);
      if (fetchedReview) {
        setReview(fetchedReview[0]); // Set review if it exists
      }
    };

    fetchOwnersReview();
  }, [courseId]);

  // Use Formik to manage the form state and validation
  const formik = useFormik({
    initialValues: {
      reviewRating: review?.rating || 0,
      reviewText: review?.review_text || "",
    },
    enableReinitialize: true, // Reinitialize form values when review data is fetched
    validationSchema: reviewSchema,
    onSubmit: async (values, { resetForm }) => {
      const { reviewRating, reviewText } = values;

      if (
        review &&
        reviewRating === review.rating &&
        reviewText === review.review_text
      ) {
        setIsEditing(false);
        return;
      }

      if (review) {
        const reviewUpdated = await updateReviewService({
          reviewId: review.id,
          courseId,
          reviewRating,
          reviewText,
        });
        setReview(reviewUpdated);
        setReviewUpdated((prev) => !prev);
      } else {
        // Call the service to create/update the review
        const reviewCreated = await createReviewService({
          courseId,
          reviewRating,
          reviewText,
        });
        setReview(reviewCreated);
      }

      // Reset the form after submission
      resetForm();
      setIsEditing(false); // Switch back to view mode after submitting
    },
  });

  // Cancel editing
  const handleCancelEdit = () => {
    setIsEditing(false);
    formik.resetForm({
      values: {
        reviewRating: review?.rating || 0,
        reviewText: review?.review_text || "",
      },
    });
  };

  return (
    <div className="mx-auto md:w-2/3">
      {/* Conditionally render the form or the display mode */}
      {!isEditing && review ? (
        // Display mode (showing review and rating)
        <div className="mb-5 border-b-2 border-gray-300 pb-7 md:w-4/5">
          <div className="flex w-auto gap-2">
            <h3 className="text-sm font-semibold text-gray-500">Your Review</h3>
            {!isEditing && (
              <button type="button" onClick={() => setIsEditing(true)}>
                <EditIcon />
              </button>
            )}
          </div>

          <p>
            <ReactStarsWrapper edit={false} value={review?.rating} />
            {isExpanded
              ? review.review_text
              : getTruncatedText(review.review_text)}
            {review.review_text.split(" ").length > 75 && (
              <button
                className="ml-2 text-xs font-semibold text-gray-500"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? "See Less" : "See More"}
              </button>
            )}
          </p>
        </div>
      ) : (
        // Form mode (create or edit review)
        <form onSubmit={formik.handleSubmit} className="w-full">
          {/* Rating input */}
          <div className="">
            <label className="block text-sm font-bold text-gray-700 md:text-lg">
              Rate this course
            </label>
            <ReactStarsWrapper
              onChange={(newRating) =>
                formik.setFieldValue("reviewRating", newRating)
              }
              value={review?.rating}
            />
            {formik.touched.reviewRating && formik.errors.reviewRating && (
              <div className="text-sm text-red-500">
                {formik.errors.reviewRating}
              </div>
            )}
          </div>

          {/* Review text input */}
          <div className="mb-5 border-b-2 border-gray-200 pb-7">
            <div className="mb-3">
              <label className="mb-2 block text-xs font-semibold text-gray-500 md:text-sm">
                Add your review
              </label>
              <input
                type="text"
                name="reviewText"
                value={formik.values.reviewText}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Write your review..."
                className={`w-full rounded border p-3 text-sm ${
                  formik.touched.reviewText && formik.errors.reviewText
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {formik.touched.reviewText && formik.errors.reviewText && (
                <div className="text-sm text-red-500">
                  {formik.errors.reviewText}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              {/* Submit button */}
              <button type="submit" disabled={formik.isSubmitting}>
                <Button text={review ? "Update Review" : "Submit Review"} />
              </button>

              {/* Cancel button only shown when editing */}
              {isEditing && (
                <button type="button" onClick={handleCancelEdit}>
                  <Button bg={false} text={"Cancel"} />
                </button>
              )}
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default ReviewForm;
