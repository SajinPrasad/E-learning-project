import React, { useEffect, useState } from "react";

import { getCommentsService } from "../../services/CommentServices/commentServices";
import { getInitialsService } from "../../services/userManagementServices/profileServices";

const CommentList = ({ courseId }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      const fetchedComments = await getCommentsService(courseId);
      if (fetchedComments) {
        setComments(fetchedComments);
      }
    };

    fetchComments();
  }, [courseId]);

  const formatCommentDate = (dateString) => {
    const commentDate = new Date(dateString);
    const today = new Date();

    // Check if the comment was made today
    const isToday = commentDate.toDateString() === today.toDateString();

    if (isToday) {
      // Format time for today's comments (e.g., "2:30 PM")
      return commentDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } else {
      // Format date for older comments (e.g., "Oct 22")
      return commentDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  return (
    <div className="mx-auto my-8 w-2/3">
      {comments?.length === 0 ? (
        <p className="py-8 text-center text-gray-500">
          No comments yet. Be the first to comment!
        </p>
      ) : (
        <div className="space-y-4">
          {" "}
          {/* Container for comments with consistent spacing */}
          {comments?.map((comment) => (
            <div
              key={comment.id}
              className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {comment.user_profile_picture ? (
                    <img
                      src={`http://localhost:8000${comment.user_profile_picture}`}
                      className="h-10 w-10 rounded-full object-cover"
                      alt={comment.user_fullname}
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                      <span className="font-medium text-gray-600">
                        {getInitialsService(comment.user_fullname)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <h5 className="text-sm font-semibold text-gray-800">
                      {comment.user_fullname}
                    </h5>
                    <span className="text-xs text-gray-400">
                      {formatCommentDate(comment.created_at)}
                    </span>
                  </div>
                  <p className="mt-1 whitespace-pre-wrap break-words text-sm text-gray-600">
                    {comment.comment}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentList;
