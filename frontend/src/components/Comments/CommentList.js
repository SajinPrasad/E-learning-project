import React, { useEffect, useState, useRef } from "react";
import { getInitialsService } from "../../services/userManagementServices/profileServices";
import {
  getParentCommentsService,
  getProfilePictureService,
  getReplayCommentsService,
} from "../../services/CommentServices/commentServices";

const CommentList = ({ courseId, ws, setParentComment }) => {
  const [comments, setComments] = useState([]); // Parent comments
  const [replies, setReplies] = useState({}); // Store replies for each comment
  const commentsEndRef = useRef(null); // Ref for scrolling to bottom

  // Scroll to the bottom of the comments list
  const scrollToBottom = () => {
    if (commentsEndRef.current) {
      commentsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    // WebSocket handling for new comments
    if (ws) {
      ws.onmessage = async (event) => {
        const newComment = JSON.parse(event.data);
        await fetchProfilePictureAndAddComment(newComment);
      };
    }

    return () => {
      if (ws) ws.onmessage = null;
    };
  }, [ws]);

  // Function to fetch profile picture and add the comment
  const fetchProfilePictureAndAddComment = async (newComment) => {
    try {
      // Fetch profile picture for the comment
      const fetchedProfilePicture = await getProfilePictureService(
        newComment.user_id,
      );

      // Combine comment data with profile picture
      const completeComment = fetchedProfilePicture
        ? {
            ...newComment,
            user_profile_picture: fetchedProfilePicture.profile_picture_url,
          }
        : newComment;

      // Check if it's a reply (has parent) or a parent comment
      if (completeComment.parent_id) {
        // It's a reply - update replies state
        setReplies((prevReplies) => {
          const parentId = completeComment.parent_id;
          const existingReplies = prevReplies[parentId] || [];

          return {
            ...prevReplies,
            [parentId]: [...existingReplies, completeComment],
          };
        });

        // Update reply count for parent comment
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === completeComment.parent_id
              ? { ...comment, replay_count: (comment.replay_count || 0) + 1 }
              : comment,
          ),
        );
      } else {
        // It's a parent comment - update comments state
        setComments((prevComments) => [...prevComments, completeComment]);
      }

      // Scroll to bottom after state updates
      scrollToBottom();
    } catch (error) {
      console.error("Error processing new comment:", error);
      // You might want to add error handling UI feedback here
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      const fetchedComments = await getParentCommentsService(courseId);
      if (fetchedComments) {
        setComments(fetchedComments);
        scrollToBottom();
      }
    };

    fetchComments();
  }, [courseId]);

  // Fetch replies for a specific parent comment
  const handleFetchingReplayComments = async (parentId) => {
    // Check if the replies are already fetched
    if (!replies[parentId]) {
      const fetchedReplies = await getReplayCommentsService(courseId, parentId);
      setReplies((prevReplies) => ({
        ...prevReplies,
        [parentId]: fetchedReplies, // Store the fetched replies in the state
      }));
    }
  };

  const formatCommentDate = (dateString) => {
    const commentDate = new Date(dateString);
    const today = new Date();
    const isToday = commentDate.toDateString() === today.toDateString();

    return isToday
      ? commentDate.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      : commentDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
  };

  return (
    <div className="mx-auto my-8 w-2/3">
      {comments?.length === 0 ? (
        <p className="py-8 text-center text-gray-500">
          No comments yet. Be the first to comment!
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment, index) => (
            <div key={index}>
              <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
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

              {/* Conditionally render replies for this comment */}
              {replies[comment.id] &&
                replies[comment.id].map((reply, replyIndex) => (
                  <div
                    key={`${comment.id}-${replyIndex}`}
                    className="ml-8 mt-2 rounded-lg border border-gray-200 bg-gray-50 p-3 shadow-sm"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {reply.user_profile_picture ? (
                          <img
                            src={`http://localhost:8000${reply.user_profile_picture}`}
                            className="h-8 w-8 rounded-full object-cover"
                            alt={reply.user_fullname}
                          />
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
                            <span className="font-medium text-gray-600">
                              {getInitialsService(reply.user_fullname)}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex-grow">
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs font-semibold text-gray-800">
                            {reply.user_fullname}
                          </h5>
                          <span className="text-xs text-gray-400">
                            {formatCommentDate(reply.created_at)}
                          </span>
                        </div>
                        <p className="mt-1 whitespace-pre-wrap break-words text-sm text-gray-600">
                          {reply.comment}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ))}
          <div ref={commentsEndRef} />
        </div>
      )}
    </div>
  );
};

export default CommentList;
