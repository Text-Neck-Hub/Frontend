// src/pages/PostEditorPage.tsx
import React from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom"; // ⭐️ useNavigate 훅을 가져와!
import PostEditor from "../../components/editors/PostEditor";
import { writePost } from "../../apis/board";
import { type PostDetailProps } from "../../types/Post";

const PageTitle = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
`;

const PostEditorPage: React.FC = () => {
  const navigate = useNavigate(); // ⭐️ useNavigate 훅을 호출해서 navigate 함수를 가져와!
  const { boardType: boardSlug } = useParams<{ boardType: string }>(); 

  if (!boardSlug) {
    return <div>오류: 게시판 카테고리 정보가 없습니다.</div>;
  }

  type SubmitPostData = Pick<PostDetailProps, 'title' | 'content'> & {
    thumbnailFile?: File;
    attachedFiles: File[];
  };

  const handlePostSubmit = async (data: SubmitPostData) => {
    console.log("게시물 제출 데이터:", data);

    const postData: PostDetailProps = {
      createdAt: new Date().toISOString(),
      title: data.title,
      content: data.content,
      // 여기에 author, email 등 백엔드 Post 모델에 맞는 필드를 추가해야 할 수도 있어.
      // 지금은 백엔드에서 request.user.id, request.user.email을 가져오니 따로 보내지 않아도 될 거야!
    };

    try {
      const result = await writePost(boardSlug, postData); 
      console.log("게시물 작성 성공:", result);
      alert("게시물이 성공적으로 작성되었습니다!");
      
      // ⭐️ 여기! navigate 함수를 사용해서 페이지 이동!
      // 보통은 작성된 게시물의 상세 페이지로 이동하거나, 게시판 목록 페이지로 이동해!
      // 예: navigate(`/boards/${boardSlug}/posts/${result.id}`); // 작성된 게시물 상세 페이지로
      navigate('/'); // 지금은 홈으로 이동하도록 설정할게!

    } catch (error) {
      console.error("게시물 작성 실패:", error);
      alert("게시물 작성에 실패했습니다. 다시 시도해주세요!");
    }
  };

  return (
    <div>
      <PageTitle>게시물 작성/수정</PageTitle>
      <PostEditor onSubmit={handlePostSubmit} />
    </div>
  );
};

export default PostEditorPage;