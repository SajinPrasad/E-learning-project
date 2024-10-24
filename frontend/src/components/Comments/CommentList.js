import React, { useEffect, useState, useRef } from "react";
import { getInitialsService } from "../../services/userManagementServices/profileServices";
import {
  getParentCommentsService,
  getProfilePictureService,
  getReplayCommentsService,
} from "../../services/CommentServices/commentServices";

const CommentList = ({ courseId, ws, setParentComment }) => {
  const [comments, setComments] = useState([]);
  const commentsEndRef = useRef(null); // Create a ref for the end of the comments list

  // Function to scroll to the bottom of the comments list
  const scrollToBottom = () => {
    if (commentsEndRef.current) {
      commentsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    // Set up WebSocket message handling
    if (ws) {
      // Mark the onmessage handler as async
      ws.onmessage = (event) => {
        const newComment = JSON.parse(event.data);

        const fetchProfilePicture = async () => {
          const fetchedProfilePicture = await getProfilePictureService(
            newComment.user_id,
          );
          console.log("Fetched Profile: ", fetchedProfilePicture);

          if (fetchedProfilePicture) {
            // Add the profile picture to the new comment object
            const completeComment = {
              ...newComment,
              user_profile_picture: fetchedProfilePicture.profile_picture_url, // Assuming the service returns the URL in this format
            };

            // Update the comments state with the complete comment
            setComments((prevComments) => [...prevComments, completeComment]);
          } else {
            setComments((prevComments) => [...prevComments, newComment]);
          }
        };

        fetchProfilePicture();

        // Scroll to the bottom when a new comment is added
        scrollToBottom();
      };
    }

    return () => {
      if (ws) ws.onmessage = null; // Clean up WebSocket handler on unmount
    };
  }, [ws]);

  useEffect(() => {
    const fetchComments = async () => {
      const fetchedComments = await getParentCommentsService(courseId);
      if (fetchedComments) {
        setComments(fetchedComments);
        scrollToBottom(); // Scroll to the bottom after fetching comments
      }
    };

    fetchComments();
  }, [courseId]);

  const handleFetchingReplayComments = async (parentId) => {
    const fetchedReplaies = await getReplayCommentsService(courseId, parentId);
  };

  const formatCommentDate = (dateString) => {
    const commentDate = new Date(dateString);

    if (isNaN(commentDate)) {
      return "Invalid Date"; // Handle invalid date case
    }

    const today = new Date();
    const isToday = commentDate.toDateString() === today.toDateString();
    if (isToday) {
      return commentDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } else {
      return commentDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  console.log("Comments: ", comments);

  return (
    <div className="mx-auto my-8 w-2/3">
      {comments?.length === 0 ? (
        <p className="py-8 text-center text-gray-500">
          No comments yet. Be the first to comment!
        </p>
      ) : (
        <div className="space-y-4">
          {comments?.map((comment, index) => (
            <>
              <div
                key={index}
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
                        {formatCommentDate(comment.timestamp)}
                      </span>
                    </div>
                    <p className="mt-1 whitespace-pre-wrap break-words text-sm text-gray-600">
                      {comment.comment}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-5">
                <p
                  onClick={() => setParentComment(comment)}
                  className="w-fit cursor-pointer text-xs text-gray-400 hover:text-gray-600"
                >
                  Reply
                </p>
                {comment.replay_count > 0 && (
                  <i
                    onClick={() => handleFetchingReplayComments(comment.id)}
                    className="cursor-pointer text-xs font-semibold"
                  >
                    {comment.replay_count} Replies
                  </i>
                )}
              </div>
            </>
          ))}
          {/* Dummy div to mark the end of comments for scrolling */}
          <div ref={commentsEndRef} />
        </div>
      )}
    </div>
  );
};

export default CommentList;
