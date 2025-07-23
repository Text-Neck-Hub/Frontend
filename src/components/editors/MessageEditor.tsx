import React, { useState } from "react";
import styled from "styled-components";
import QuillEditor from "./QuillEditor";
import { messageToolbarOptions } from "../../utils/toolbarOptions";

const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const Label = styled.label`
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #333;
`;

const FileInputLabel = styled.label`
  display: inline-block;
  padding: 0.6rem 1rem;
  background-color: #6c757d;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  &:hover {
    background-color: #5a6268;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const SendButton = styled.button`
  padding: 0.8rem 1.2rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

interface MessageEditorProps {
  onSend: (data: { content: string; attachedFiles: File[] }) => void;
}

const MessageEditor: React.FC<MessageEditorProps> = ({ onSend }) => {
  const [content, setContent] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  const handleAttachedFilesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      setAttachedFiles(Array.from(e.target.files));
    }
  };

  const handleSend = () => {
    onSend({ content, attachedFiles });
    setContent("");
    setAttachedFiles([]);
  };

  return (
    <EditorContainer>
      <Label>메시지 내용</Label>
      <QuillEditor
        value={content}
        onChange={setContent}
        placeholder="메시지를 입력하세요."
        toolbarOptions={messageToolbarOptions}
      />

      <FileInputLabel htmlFor="messageAttachedFiles">
        {attachedFiles.length > 0
          ? `${attachedFiles.length}개 파일 선택됨`
          : "파일 첨부"}
      </FileInputLabel>
      <HiddenFileInput
        id="messageAttachedFiles"
        type="file"
        multiple
        onChange={handleAttachedFilesChange}
      />

      <SendButton onClick={handleSend}>메시지 전송</SendButton>
    </EditorContainer>
  );
};

export default MessageEditor;
