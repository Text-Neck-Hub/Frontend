import React, { useState } from "react";
import styled from "styled-components";
import QuillEditor from "./QuillEditor";
import { postToolbarOptions } from "../../utils/toolbarOptions";

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #333;
`;

const Input = styled.input`
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  &:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

const FileInputLabel = styled.label`
  display: inline-block;
  padding: 0.8rem 1.2rem;
  background-color: #007bff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  &:hover {
    background-color: #0056b3;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const SubmitButton = styled.button`
  padding: 1rem 1.5rem;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  cursor: pointer;
  &:hover {
    background-color: #218838;
  }
`;

interface PostEditorProps {
  // 👈 PostWriteFormProps를 PostEditorProps로 변경!
  onSubmit: (data: {
    title: string;
    content: string;
    thumbnailFile?: File;
    attachedFiles: File[];
  }) => void;
}

const PostEditor: React.FC<PostEditorProps> = ({ onSubmit }) => {
  // 👈 PostWriteForm을 PostEditor로 변경!
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | undefined>(
    undefined
  );
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnailFile(e.target.files[0]);
    }
  };

  const handleAttachedFilesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      setAttachedFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = () => {
    onSubmit({ title, content, thumbnailFile, attachedFiles });
    setTitle("");
    setContent("");
    setThumbnailFile(undefined);
    setAttachedFiles([]);
  };

  return (
    <FormContainer>
      <InputGroup>
        <Label htmlFor="postTitle">제목</Label>
        <Input
          id="postTitle"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="게시물 제목을 입력하세요."
        />
      </InputGroup>

      <InputGroup>
        <Label>콘텐츠</Label>
        <QuillEditor
          value={content}
          onChange={setContent}
          placeholder="내용을 입력하세요."
          toolbarOptions={postToolbarOptions}
        />
      </InputGroup>

      <InputGroup>
        <Label>썸네일 파일</Label>
        <FileInputLabel htmlFor="thumbnailUpload">
          {thumbnailFile ? thumbnailFile.name : "썸네일 선택"}
        </FileInputLabel>
        <HiddenFileInput
          id="thumbnailUpload"
          type="file"
          accept="image/*"
          onChange={handleThumbnailChange}
        />
      </InputGroup>

      <InputGroup>
        <Label>첨부 파일</Label>
        <FileInputLabel htmlFor="attachedFilesUpload">
          {attachedFiles.length > 0
            ? `${attachedFiles.length}개 파일 선택됨`
            : "파일 선택"}
        </FileInputLabel>
        <HiddenFileInput
          id="attachedFilesUpload"
          type="file"
          multiple
          onChange={handleAttachedFilesChange}
        />
      </InputGroup>

      <SubmitButton onClick={handleSubmit}>게시물 작성</SubmitButton>
    </FormContainer>
  );
};

export default PostEditor; // 👈 export default도 PostEditor로 변경!
