import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

import { Button } from "../common";
import CommentList from "./CommentList";

const CommentForm = ({ courseId }) => {
  const { accessToken } = useSelector((state) => state.auth);
  const [comment, setComment] = useState("");
  const [ws, setWs] = useState(null); // Store WebSocket connection
  const wsRef = useRef(null);

  useEffect(() => {
    if (accessToken) {
      // Create WebSocket connection when the component mounts
      const socket = new WebSocket(
        `ws://localhost:8000/ws/comments/course/${courseId}/?token=${accessToken}`,
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
      const message = JSON.stringify({
        comment: comment, // Sending the comment payload
      });
      ws.send(message);
      setComment(""); // Clear the input after sending
    }
  };

  return (
    <>
      <div className="mx-auto w-full max-w-2xl rounded-lg bg-white p-6 shadow-md">
        <h4 className="mb-4 text-lg font-semibold text-gray-800">
          Write your comment here
        </h4>
        <div className="flex flex-col space-y-4">
          <textarea
            name="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Enter..."
            className="w-full h-24 rounded-md border border-gray-300 px-4 py-2 placeholder-gray-400 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex justify-end">
            <span onClick={handlePostingComment} className="inline-block">
              <Button text={"Post"} />
            </span>
          </div>
        </div>
      </div>

      <CommentList courseId={courseId} ws={wsRef.current} />
    </>
  );
};

export default CommentForm;
