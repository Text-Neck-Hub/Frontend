import React from 'react';
import styled from 'styled-components';

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

export interface CommentListProps {
  comments: string[];
}

export const CommentList: React.FC<CommentListProps> = ({ comments }) => (
  <CommentListContainer>
    {comments.map((comment, idx) => (
      <CommentItem key={idx}>{comment}</CommentItem>
    ))}
  </CommentListContainer>
);
