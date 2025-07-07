import React, { useState, useEffect } from "react"; // 👈 useEffect 추가
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
  initialContent?: string; // 👈 초기 내용 (수정 모드일 때 사용)
  onCommentSubmit: (content: string) => void;
  onCancel?: () => void; // 👈 취소 버튼 클릭 시 (수정 모드일 때만 존재)
  submitButtonText?: string; // 👈 제출 버튼 텍스트 (기본값: "댓글 작성")
}

const CommentEditor: React.FC<CommentEditorProps> = ({
  initialContent = "", // 👈 초기 내용이 없으면 빈 문자열
  onCommentSubmit,
  onCancel, // 👈 onCancel 프롭 추가
  submitButtonText = "댓글 작성", // 👈 submitButtonText 프롭 추가
}) => {
  const [content, setContent] = useState(initialContent);

  // 👈 initialContent가 변경될 때 content 상태도 업데이트 (수정 모드 진입 시)
  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleSubmit = () => {
    onCommentSubmit(content);
    // 👈 제출 후 내용 초기화는 외부에서 처리하도록 함 (수정 완료 후에는 초기화하지 않을 수 있으므로)
  };

  const handleCancel = () => {
    // 👈 취소 버튼 핸들러 추가
    if (onCancel) {
      onCancel();
    }
    setContent(""); // 취소 시 에디터 내용 초기화
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
        {" "}
        {/* 👈 버튼들을 ButtonGroup으로 묶어줘 */}
        {onCancel && (
          <CancelButton onClick={handleCancel}>취소</CancelButton>
        )}{" "}
        {/* 👈 onCancel이 있을 때만 취소 버튼 보임 */}
        <SubmitButton onClick={handleSubmit}>
          {submitButtonText}
        </SubmitButton>{" "}
        {/* 👈 버튼 텍스트 동적 변경 */}
      </ButtonGroup>
    </CommentContainer>
  );
};

export default CommentEditor;
