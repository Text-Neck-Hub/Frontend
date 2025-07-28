import React, { useEffect, useState, useCallback } from "react"; // useEffect, useState, useCallback 추가
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom"; // useNavigate 추가
import PostEditor from "../../components/editors/PostEditor";
import { writePost, getPostDetail, updatePost } from "../../apis/board"; // getPostDetail, updatePost 추가
import { type PostDetailProps } from "../../types/Post";

const PageTitle = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
`;

const PostEditorPage: React.FC = () => {
  const navigate = useNavigate();
  // URL 파라미터에서 게시판 종류와 게시물 ID 가져오기
  const { boardType: boardSlug, postId: idFromParams } = useParams<{ boardType: string; postId: string }>();
  // postId가 있으면 수정 모드, 없으면 생성 모드
  const isEditing = !!idFromParams; 
  const postId = isEditing ? Number(idFromParams) : undefined; // 수정 모드일 때만 postId가 숫자로 존재

  const [initialPostData, setInitialPostData] = useState<PostDetailProps | null>(null);
  const [loading, setLoading] = useState(isEditing); // 수정 모드면 초기 로딩 상태 true

  // 수정 모드일 때 게시물 데이터 불러오기
  const fetchPostData = useCallback(async () => {
    if (isEditing && boardSlug && postId) {
      try {
        const data = await getPostDetail(boardSlug, postId);
        setInitialPostData(data);
      } catch (error) {
        console.error("게시물 정보를 불러오는 데 실패했습니다:", error);
        alert("게시물 정보를 불러오는 데 실패했습니다. ㅠㅠ");
        navigate(-1); // 이전 페이지로 돌아가기
      } finally {
        setLoading(false);
      }
    } else { // 생성 모드일 때는 로딩 없음
      setLoading(false);
    }
  }, [isEditing, boardSlug, postId, navigate]);

  useEffect(() => {
    fetchPostData();
  }, [fetchPostData]);


  // PostEditor에서 받을 데이터 타입
  type SubmitPostData = Pick<PostDetailProps, 'title' | 'content'> & {
    thumbnailFile?: File;
    attachedFiles: File[];
  };

  const handlePostSubmit = async (data: SubmitPostData) => {
    console.log("게시물 제출 데이터:", data);

    if (!boardSlug) {
      alert("게시판 종류를 알 수 없습니다.");
      return;
    }

    const postData: PostDetailProps = {
      title: data.title,
      content: data.content,
      // created_at 등은 서버에서 생성되므로 보내지 않아도 됨
    };

    try {
      let result: PostDetailProps;
      if (isEditing && postId) {
        // 수정 모드일 때
        result = await updatePost(boardSlug, postId, postData);
        alert("게시물이 성공적으로 수정되었습니다!");
      } else {
        // 생성 모드일 때
        result = await writePost(boardSlug, postData); 
        alert("게시물이 성공적으로 작성되었습니다!");
      }
      console.log("처리 성공:", result);
      // 처리 후 해당 게시물 상세 페이지로 이동
      navigate(`/boards/${boardSlug}/posts/${result.id}/`); 
    } catch (error) {
      console.error("게시물 처리 실패:", error);
      alert("게시물 처리(작성/수정)에 실패했습니다. ㅠㅠ 다시 시도해주세요!");
    }
  };

  if (loading) {
    return (
      <PageTitle>
        {isEditing ? "게시물 불러오는 중..." : "새 게시물 작성"}
      </PageTitle>
    );
  }

  return (
    <div>
      <PageTitle>
        {isEditing ? "게시물 수정" : "새 게시물 작성"}
      </PageTitle>
      <PostEditor
        onSubmit={handlePostSubmit}
        initialTitle={initialPostData?.title} // 수정 모드일 때 초기 제목 전달
        initialContent={initialPostData?.content} // 수정 모드일 때 초기 내용 전달
      />
    </div>
  );
};

export default PostEditorPage;