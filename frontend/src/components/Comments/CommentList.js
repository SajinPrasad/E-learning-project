import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";

import { getInitialsService } from "../../services/userManagementServices/profileServices";
import {
  getParentCommentsService,
  getProfilePictureService,
  getReplayCommentsService,
} from "../../services/CommentServices/commentServices";

const CommentList = ({ courseId, ws, setParentComment }) => {
  const [comments, setComments] = useState([]);
  const [replies, setReplies] = useState({});
  const commentsEndRef = useRef(null);
  const role = useSelector((state) => state.user.role);

  const scrollToBottom = () => {
    if (commentsEndRef.current) {
      commentsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
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

  const fetchProfilePictureAndAddComment = async (newComment) => {
    try {
      const fetchedProfilePicture = await getProfilePictureService(
        newComment.user_id,
      );
      const completeComment = fetchedProfilePicture
        ? {
            ...newComment,
            user_profile_picture: fetchedProfilePicture.profile_picture_url,
          }
        : newComment;

      if (completeComment.parent_id) {
        setReplies((prevReplies) => {
          const parentId = completeComment.parent_id;
          const existingReplies = prevReplies[parentId] || [];
          return {
            ...prevReplies,
            [parentId]: [...existingReplies, completeComment],
          };
        });

        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === completeComment.parent_id
              ? { ...comment, replay_count: (comment.replay_count || 0) + 1 }
              : comment,
          ),
        );
      } else {
        setComments((prevComments) => [...prevComments, completeComment]);
      }

      if (role === "student") {scrollToBottom();}
      
    } catch (error) {
      console.error("Error processing new comment:", error);
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      const fetchedComments = await getParentCommentsService(courseId);
      if (fetchedComments) {
        setComments(fetchedComments);
        if (role === "student") {scrollToBottom();}
      }
    };

    fetchComments();
  }, [courseId]);

  const handleFetchingReplayComments = async (parentId) => {
    if (!replies[parentId]) {
      const fetchedReplies = await getReplayCommentsService(courseId, parentId);
      setReplies((prevReplies) => ({
        ...prevReplies,
        [parentId]: fetchedReplies,
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

  const renderComments = (commentsToRender, level = 0) =>
    commentsToRender.map((comment, index) => (
      <div
        key={`${comment.id}-${index}`}
        style={{ marginLeft: `${Math.min(level, 5) * 16}px` }}
        className="mt-2"
      >
        <div
          className={`rounded-lg border ${level === 0 ? "bg-white" : "bg-gray-50"} p-3 shadow-sm`}
        >
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              {comment.user_profile_picture ? (
                <img
                  src={comment.user_profile_picture}
                  className="h-8 w-8 rounded-full object-cover"
                  alt={comment.user_fullname}
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
                  <span className="font-medium text-gray-600">
                    {getInitialsService(comment.user_fullname)}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-grow">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-semibold text-gray-800">
                  {comment.user_fullname}
                </h5>
                <span className="text-xs text-gray-400">
                  {formatCommentDate(comment.created_at)}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-600">{comment.comment}</p>
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
          {replies[comment.id] && (
            <div className="ml-4 mt-2">
              {renderComments(replies[comment.id], level + 1)}
            </div>
          )}
        </div>
      </div>
    ));

  return (
    <div className="mx-auto my-8 h-[calc(100vh-16rem)] w-2/3 overflow-y-auto">
      {comments.length === 0 ? (
        <p className="py-8 text-center text-gray-500">
          No comments yet. Be the first to comment!
        </p>
      ) : (
        <div className="space-y-4">
          {renderComments(comments)}
          <div ref={commentsEndRef} />
        </div>
      )}
    </div>
  );
};

export default CommentList;
