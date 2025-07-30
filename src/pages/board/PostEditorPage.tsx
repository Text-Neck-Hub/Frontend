import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import PostEditor from "../../components/editors/PostEditor";
import { writePost, getPostDetail, updatePost } from "../../apis/board";
import type { PostDetail } from "../../types/Post";

const PageTitle = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
`;

const PostEditorPage: React.FC = () => {
  const navigate = useNavigate();
  const { boardType, postId: idFromParams } = useParams<{ boardType: string; postId?: string }>();

  const isEditing = Boolean(idFromParams);
  const postId = isEditing ? Number(idFromParams) : null;

  const [initialPostData, setInitialPostData] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(isEditing);

  const fetchPostData = useCallback(async () => {
    if (!isEditing || !boardType || !postId) return setLoading(false);

    try {
      const data = await getPostDetail(boardType, postId);
      setInitialPostData(data);
    } catch (error) {
      console.error("게시물 정보를 불러오는 데 실패했습니다:", error);
      alert("게시물 정보를 불러오는 데 실패했습니다.");
      navigate(-1);
    } finally {
      setLoading(false);
    }
  }, [isEditing, boardType, postId, navigate]);

  useEffect(() => {
    fetchPostData();
  }, [fetchPostData]);


 const handlePostSubmit = async ({
  title,
  content,

}: {
  title: string;
  content: string;
  thumbnailFile?: File;
  attachedFiles: File[];
}) => {
  if (!boardType) {
    alert("게시판 종류를 알 수 없습니다.");
    return;
  }

  const postData: PostDetail = {
    id: initialPostData?.id || -1,
    author: initialPostData?.author || -1,
    title,
    content,
    thumbnailFile:  initialPostData?.thumbnailFile || undefined,
    
    
  };

  try {
    const result = isEditing && postId
      ? await updatePost(boardType, postId, postData)
      : await writePost(boardType, postData);

    alert(`게시물이 성공적으로 ${isEditing ? "수정" : "작성"}되었습니다!`);
    navigate(`/boards/${boardType}/posts/${result.id}/`);
  } catch (error) {
    console.error("게시물 처리 실패:", error);
    alert("게시물 처리에 실패했습니다. 다시 시도해주세요.");
  }
};


  if (loading) {
    return <PageTitle>{isEditing ? "게시물 불러오는 중..." : "새 게시물 작성"}</PageTitle>;
  }

  return (
    <div>
      <PageTitle>{isEditing ? "게시물 수정" : "새 게시물 작성"}</PageTitle>
      <PostEditor
        onSubmit={handlePostSubmit}
        initialTitle={initialPostData?.title}
        initialContent={initialPostData?.content}
      />
    </div>
  );
};

export default PostEditorPage;
