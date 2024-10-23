import React, { useState } from "react";

import { Button } from "../common";
import { postCommentService } from "../../services/CommentServices/commentServices";
import CommentList from "./CommentList";

const CommentForm = ({ courseId }) => {
  const [comment, setComment] = useState("");

  const handlePostingComment = async () => {
    const commentPosted = await postCommentService(courseId, comment);

    if (commentPosted) {
      setComment("");
    }
  };

  return (
    <>
      <div className="mx-auto w-full max-w-2xl rounded-lg bg-white p-6 shadow-md">
        <h4 className="mb-4 text-lg font-semibold text-gray-800">
          Write your comment here
        </h4>

        <div className="flex flex-col space-y-4">
          <input
            name="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Enter..."
            className="w-full rounded-md border border-gray-300 px-4 py-2 placeholder-gray-400 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex justify-end">
            <span onClick={handlePostingComment} className="inline-block">
              <Button text={"Post"} />
            </span>
          </div>
        </div>
      </div>

      <CommentList courseId={courseId} />
    </>
  );
};

export default CommentForm;
