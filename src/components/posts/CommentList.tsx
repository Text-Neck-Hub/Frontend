import React from "react";
import styled from "styled-components";
import type { CommentListProps, CommentProps } from "../../types/Comment"; // CommentProps도 임포트 필요

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

export const CommentList: React.FC<CommentListProps> = ({ comments }) => {
  return (
    <CommentListContainer>
      {/* comments가 유효한 배열이고 비어있지 않을 때만 map을 호출 */}
      {comments && Array.isArray(comments) && comments.length > 0 ? (
        comments.map((comment: CommentProps) => ( // comment 타입 명시
          // 각 댓글의 고유 ID를 key로 사용하는 것이 좋습니다. (comment.id가 있다고 가정)
          <CommentItem key={comment.id || `comment-${comment.content.slice(0,10)}-${Math.random()}`}>
            {comment.content}
          </CommentItem>
        ))
      ) : (
        <CommentItem>아직 댓글이 없습니다.</CommentItem>
      )}
    </CommentListContainer>
  );
};