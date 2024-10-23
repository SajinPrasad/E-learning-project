import React from "react";

import { CommentForm } from "../../components/Comments";

const CommentsPage = ({ courseId }) => {
  return (
    <>
      <CommentForm courseId={courseId} />
    </>
  );
};

export default CommentsPage;
