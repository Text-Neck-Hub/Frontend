import React, { useState, useEffect } from "react";
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

const ButtonGroup = styled.div`
  // 👈 버튼들을 묶어줄 컨테이너 추가
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
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

const CancelButton = styled.button`
  // 👈 취소 버튼 스타일 추가
  padding: 0.7rem 1rem;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  &:hover {
    background-color: #5a6268;
  }
`;

interface CommentEditorProps {
  initialContent?: string;
  onCommentSubmit: (content: string) => void;
  onCancel?: () => void;
  submitButtonText?: string;
}

const CommentEditor: React.FC<CommentEditorProps> = ({
  initialContent = "",
  onCommentSubmit,
  onCancel,
  submitButtonText = "댓글 작성",
}) => {
  const [content, setContent] = useState(initialContent);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleSubmit = () => {
    onCommentSubmit(content);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
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
      <ButtonGroup>
        {onCancel && <CancelButton onClick={handleCancel}>취소</CancelButton>}
        <SubmitButton onClick={handleSubmit}>{submitButtonText}</SubmitButton>
      </ButtonGroup>
    </CommentContainer>
  );
};

export default CommentEditor;
