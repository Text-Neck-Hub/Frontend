import React from "react";
import styled from "styled-components";
import type { Comment } from "../../types/Comment";


const CommentListContainer = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const CommentItem = styled.li`
  background: #f7f7f7;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  color: #333;
`;


interface CommentListProps {
  comments: Comment[];
}


export const CommentList: React.FC<CommentListProps> = ({ comments }) => {
  return (
    <CommentListContainer>
      {comments.length > 0 ? (
        comments.map((comment) => (
          <CommentItem key={comment.id}>{comment.content}</CommentItem>
        ))
      ) : (
        <CommentItem>아직 댓글이 없습니다.</CommentItem>
      )}
    </CommentListContainer>
  );
};
