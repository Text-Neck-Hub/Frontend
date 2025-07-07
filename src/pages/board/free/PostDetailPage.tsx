// src/pages/PostDetailPage.tsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom"; // URL 파라미터에서 ID를 가져오기 위해
import {
  getPostDetail,
  getCommentList,
  writeComment,
  updateComment,
} from "../../../apis/post"; // API 함수 불러오기
import { type PostDetailProps } from "../../../types/Post";
import { type CommentProps } from "../../../types/Comment"; // CommentData 대신 CommentProps 사용
import CommentEditor from "../../../components/editors/CommentEditor";

// --- 스타일 컴포넌트 정의 ---
const PageContainer = styled.div`
  max-width: 900px;
  margin: 2rem auto;
  padding: 1.5rem;
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
`;

const PostTitle = styled.h1`
  color: #333;
  margin-bottom: 1rem;
`;

const PostMeta = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
`;

const PostContent = styled.div`
  line-height: 1.6;
  color: #444;
  margin-bottom: 2rem;
  /* Quill 에디터에서 생성된 HTML 콘텐츠 스타일링을 위한 기본 설정 */
  & img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 1rem auto;
  }
  & pre {
    background: #f0f0f0;
    padding: 0.8rem;
    border-radius: 4px;
    overflow-x: auto;
  }
`;

const CommentSectionTitle = styled.h2`
  color: #555;
  margin-top: 2rem;
  margin-bottom: 1rem;
  border-top: 1px solid #eee;
  padding-top: 1rem;
`;

const CommentListContainer = styled.div`
  margin-top: 1.5rem;
  border-top: 1px solid #eee;
  padding-top: 1rem;
`;

const CommentItem = styled.div`
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  position: relative; /* 버튼 위치 조정을 위해 */
`;

const CommentAuthor = styled.div`
  font-weight: bold;
  color: #333;
  margin-bottom: 0.3rem;
`;

const CommentContentDisplay = styled.div`
  color: #555;
`;

const CommentDate = styled.div`
  font-size: 0.8rem;
  color: #888;
  text-align: right;
`;

const CommentActions = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  font-size: 0.8rem;
  &:hover {
    text-decoration: underline;
  }
`;

// --- PostDetailPage 컴포넌트 ---
const PostDetailPage: React.FC = () => {
  // URL 파라미터에서 게시판 종류와 게시물 ID 가져오기
  const { boardType, id } = useParams<{ boardType: string; id: string }>();
  const postId = Number(id); // 문자열 ID를 숫자로 변환

  const [post, setPost] = useState<PostDetailProps | null>(null); // PostDetailProps 대신 PostProps 사용
  const [comments, setComments] = useState<CommentProps[]>([]); // CommentListProps 대신 CommentProps[] 사용
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 댓글 수정 관련 상태
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingCommentContent, setEditingCommentContent] =
    useState<string>("");

  // 댓글 목록을 다시 불러오는 함수
  const fetchComments = async () => {
    try {
      const commentData = await getCommentList(postId, { page: 1, limit: 10 }); // 예시 페이징
      setComments(commentData);
    } catch (err) {
      console.error("댓글 목록을 불러오는 데 실패했습니다.", err);
    }
  };

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        setLoading(true);
        // boardType이 없을 경우 에러 처리
        if (!boardType) {
          setError("게시판 종류가 URL에 지정되지 않았습니다.");
          setLoading(false);
          return;
        }

        // 게시물 상세 정보 불러오기 (boardType을 첫 번째 인자로 전달)
        const postData = await getPostDetail(boardType, postId);
        setPost(postData);

        // 댓글 목록 불러오기
        await fetchComments();
      } catch (err) {
        setError("게시물 또는 댓글을 불러오는 데 실패했습니다.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    // ID와 boardType이 유효할 때만 데이터 불러오기
    if (id && boardType) {
      fetchPostAndComments();
    } else {
      setError("게시물 ID 또는 게시판 종류가 유효하지 않습니다.");
      setLoading(false);
    }
  }, [id, postId, boardType]); // ID와 boardType이 변경될 때마다 다시 불러오기

  // 댓글 작성 또는 수정 처리 함수
  const handleCommentSubmit = async (content: string) => {
    try {
      if (editingCommentId) {
        // 수정 모드일 때
        await updateComment(editingCommentId, content);
        setEditingCommentId(null); // 수정 모드 종료
        setEditingCommentContent(""); // 수정 에디터 내용 초기화
        alert("댓글이 성공적으로 수정되었습니다.");
      } else {
        // 새 댓글 작성 모드일 때
        await writeComment(postId, content);
        alert("새 댓글이 성공적으로 작성되었습니다.");
      }
      await fetchComments(); // 댓글 목록 새로고침
    } catch (err) {
      console.error("댓글 처리 중 오류 발생:", err);
      alert("댓글 처리 중 오류가 발생했습니다.");
    }
  };

  // '수정' 버튼 클릭 시 호출
  const handleEditClick = (comment: CommentProps) => {
    // CommentData 대신 CommentProps 사용
    setEditingCommentId(comment.id);
    setEditingCommentContent(comment.content);
  };

  // '취소' 버튼 클릭 시 호출 (수정 모드 취소)
  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingCommentContent("");
  };

  // --- 로딩 및 에러 상태 처리 UI ---
  if (loading) return <PageContainer>게시물과 댓글 로딩 중...</PageContainer>;
  if (error) return <PageContainer>오류: {error}</PageContainer>;
  if (!post) return <PageContainer>게시물을 찾을 수 없습니다.</PageContainer>; // 게시물 데이터가 없을 경우

  return (
    <PageContainer>
      {/* 게시물 상세 내용 표시 */}
      <PostTitle>{post.title}</PostTitle>
      <PostMeta>
        작성자: {post.author || "익명"} | 작성일:{" "}
        {new Date(post.createdAt || "").toLocaleDateString()}
      </PostMeta>
      {/* dangerouslySetInnerHTML을 사용하여 Quill 에디터의 HTML 콘텐츠를 렌더링 */}
      <PostContent dangerouslySetInnerHTML={{ __html: post.content }} />

      {/* 댓글 섹션 */}
      <CommentSectionTitle>댓글</CommentSectionTitle>
      {/* 댓글 작성/수정 에디터 */}
      <CommentEditor
        initialContent={editingCommentContent} // 수정 모드일 때 기존 내용 로드
        onCommentSubmit={handleCommentSubmit} // 댓글 제출 핸들러
        onCancel={editingCommentId ? handleCancelEdit : undefined} // 수정 모드일 때만 취소 버튼 활성화
        submitButtonText={editingCommentId ? "댓글 수정 완료" : "댓글 작성"} // 버튼 텍스트 동적 변경
      />

      {/* 댓글 목록 표시 */}
      <CommentListContainer>
        {comments.length === 0 ? (
          <p>아직 댓글이 없습니다.</p>
        ) : (
          comments.map((comment) => (
            <CommentItem key={comment.id}>
              <CommentActions>
                {/* 
                  TODO: 실제 애플리케이션에서는 현재 로그인한 사용자가 
                  이 댓글의 작성자인지 확인하는 로직이 필요해. 
                  그래야 본인 댓글만 수정/삭제 버튼이 보이도록 할 수 있어.
                */}
                <ActionButton onClick={() => handleEditClick(comment)}>
                  수정
                </ActionButton>
                {/* <ActionButton onClick={() => handleDeleteClick(comment.id)}>삭제</ActionButton> */}
              </CommentActions>
              <CommentAuthor>{comment.author}</CommentAuthor>
              <CommentContentDisplay>{comment.content}</CommentContentDisplay>
              <CommentDate>
                {new Date(comment.createdAt).toLocaleString()}
              </CommentDate>
            </CommentItem>
          ))
        )}
      </CommentListContainer>
    </PageContainer>
  );
};

export default PostDetailPage;
