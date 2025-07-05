// src/pages/PostEditorPage.tsx
import React from "react";
import styled from "styled-components";
import PostEditor from "../../components/editors/PostEditor"; // PostEditor 컴포넌트 불러오기

const PageTitle = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
`;

const PostEditorPage: React.FC = () => {
  const handlePostSubmit = (data: {
    title: string;
    content: string;
    thumbnailFile?: File;
    attachedFiles: File[];
  }) => {
    console.log("게시물 제출 데이터:", data);
    // 여기에 실제 서버로 데이터를 전송하는 로직을 구현하면 돼!
    // (예: writePost 또는 updatePost API 호출)
    alert("게시물 데이터가 콘솔에 출력되었습니다.");
  };

  return (
    <div>
      <PageTitle>게시물 작성/수정</PageTitle>
      <PostEditor onSubmit={handlePostSubmit} />
    </div>
  );
};

export default PostEditorPage;
