import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

import { Button } from "../common";
import CommentList from "./CommentList";
import { CloseIcon } from "../common/Icons";

const CommentForm = ({ courseId, selectedItem = "", setSelectedItem }) => {
  const { accessToken } = useSelector((state) => state.auth);
  const { isAuthenticated } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [ws, setWs] = useState(null); // Store WebSocket connection
  const wsRef = useRef(null);
  const [parentComment, setParentComment] = useState(null);
  const commentInputRef = useRef(null);
  const role = useSelector((state) => state.user.role);

  useEffect(() => {
    if (accessToken) {
      // Create WebSocket connection when the component mounts
      const socket = new WebSocket(
        `ws://api.brainbridgelearning.shop/ws/comments/course/${courseId}/?token=${accessToken}`,
      );
      wsRef.current = socket; // Store WebSocket reference

      socket.onopen = () => {
        console.log("WebSocket connection established");
      };

      socket.onclose = () => {
        console.log("WebSocket connection closed");
      };

      setWs(socket); // Store WebSocket instance

      return () => {
        socket.close(); // Clean up WebSocket connection when component unmounts
      };
    }
  }, [courseId]);

  const handlePostingComment = () => {
    if (comment.trim() && ws && ws.readyState === WebSocket.OPEN) {
      let message;

      if (parentComment) {
        message = JSON.stringify({
          comment: comment, // Sending the comment payload
          parent_comment_id: parentComment.id,
        });
      } else {
        message = JSON.stringify({
          comment: comment, // Sending the comment payload
        });
      }

      ws.send(message);
      setParentComment(null);
      setComment(""); // Clear the input after sending
    }
  };

  const handleSetParentComment = (comment) => {
    setParentComment(comment);
    if (commentInputRef.current) {
      commentInputRef.current.focus();
    }
  };

  return (
    <>
      {isAuthenticated && (
        <div className="mx-auto w-full max-w-2xl rounded-lg bg-white p-6 shadow-md">
          <h4 className="mb-4 text-lg font-semibold text-gray-800">
            Write your comment here
          </h4>
          <div className="flex flex-col space-y-4">
            <textarea
              ref={commentInputRef}
              name="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Enter..."
              className="h-24 w-full rounded-md border border-gray-300 px-4 py-2 placeholder-gray-400 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end">
              <span onClick={handlePostingComment} className="inline-block">
                <Button text={"Post"} />
              </span>
            </div>
          </div>
          {parentComment && (
            <div className="my-2 w-1/3 border border-gray-200">
              <div className="flex gap-2">
                <p className="text-sm">Replaying to</p>
                <span
                  className="cursor-pointer"
                  onClick={() => setParentComment(null)}
                >
                  <CloseIcon />
                </span>
              </div>
              <p className="text-xs font-semibold text-gray-600">
                @{parentComment.user_fullname}
              </p>
            </div>
          )}
        </div>
      )}

      {role !== "student" && (
        <div className="mt-10">
          {/* Fields for chosing between lessons and course details*/}
          {selectedItem === "comments" && (
            <div className="text-md my-8 flex cursor-pointer justify-around font-bold text-gray-400">
              <h4
                className={`${selectedItem === "courseDetails" && "border-b-2 border-gray-800 text-gray-800"} cursor-pointer`}
                onClick={() => setSelectedItem("courseDetails")}
              >
                Course Details
              </h4>

              <h4
                className={`${selectedItem === "lessons" && "border-b-2 border-gray-800 text-gray-800"} cursor-pointer`}
                onClick={() => setSelectedItem("lessons")}
              >
                Lessons
              </h4>

              <h4
                className={`${selectedItem === "comments" && "border-b-2 border-gray-800 text-gray-800"} cursor-pointer`}
                onClick={() => setSelectedItem("comments")}
              >
                Comments
              </h4>
            </div>
          )}
        </div>
      )}

      <CommentList
        courseId={courseId}
        ws={wsRef.current}
        setParentComment={handleSetParentComment}
      />
    </>
  );
};

export default CommentForm;
