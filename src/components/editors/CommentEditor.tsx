import React, { useState } from "react";
import styled from "styled-components";
import QuillEditor from "./QuillEditor";
import { commentToolbarOptions } from "../../utils/toolbarOptions";

const CommentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  padding: 1rem;
  background: #f0f2f5;
  border-radius: 6px;
`;

const SubmitButton = styled.button`
  padding: 0.7rem 1rem;
  background-color: #17a2b8;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  &:hover {
    background-color: #138496;
  }
`;

interface CommentEditorProps {
  onCommentSubmit: (content: string) => void;
}

const CommentEditor: React.FC<CommentEditorProps> = ({ onCommentSubmit }) => {
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    onCommentSubmit(content);
    setContent("");
  };

  return (
    <CommentContainer>
      <QuillEditor
        value={content}
        onChange={setContent}
        placeholder="댓글을 입력하세요."
        toolbarOptions={commentToolbarOptions}
      />
      <SubmitButton onClick={handleSubmit}>댓글 작성</SubmitButton>
    </CommentContainer>
  );
};

export default CommentEditor;
