import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import {
  getPostDetail,
  getCommentList,
  writeComment,
  updateComment,
  deletePost,
  deleteComment,
} from "../../apis/board";
import { type PostDetailProps } from "../../types/Post";
import { type CommentProps } from "../../types/Comment";
import { useAuth } from "../../contexts/AuthContext";

// --- UI Components (이전과 동일하므로 생략) ---
const PageContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
`;

const PostTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: #333;
`;

const PostMeta = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
`;

const PostContent = styled.div`
  font-size: 1.1rem;
  line-height: 1.6;
  color: #444;
  margin-bottom: 3rem;
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 1em 0;
  }
  p {
    margin: 0.5em 0;
  }
  ul,
  ol {
    margin-left: 2em;
  }
  strong {
    font-weight: bold;
  }
  em {
    font-style: italic;
  }
  a {
    color: #007bff;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
  img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 1em auto;
  }
  blockquote {
    border-left: 4px solid #ccc;
    padding-left: 1em;
    color: #666;
    margin: 1em 0;
  }
  pre {
    background: #f4f4f4;
    padding: 1em;
    border-radius: 4px;
    overflow-x: auto;
  }
  code {
    font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier,
      monospace;
  }
`;

const CommentSectionTitle = styled.h2`
  font-size: 1.8rem;
  margin-top: 2rem;
  margin-bottom: 1.5rem;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
`;

interface CommentEditorProps {
  initialContent: string;
  onCommentSubmit: (content: string) => void;
  onCancel?: () => void;
  submitButtonText: string;
}
const CommentEditor = ({
  initialContent,
  onCommentSubmit,
  onCancel,
  submitButtonText,
}: CommentEditorProps) => {
  const [content, setContent] = useState(initialContent);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleSubmit = () => {
    onCommentSubmit(content);
    setContent("");
  };

  return (
    <div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={5}
        style={{ width: "100%", marginBottom: "10px" }}
      />
      <button onClick={handleSubmit}>{submitButtonText}</button>
      {onCancel && (
        <button onClick={onCancel} style={{ marginLeft: "10px" }}>
          취소
        </button>
      )}
    </div>
  );
};

const CommentListContainer = styled.div`
  margin-top: 2rem;
  border-top: 1px solid #eee;
  padding-top: 1.5rem;
`;

const CommentItem = styled.div`
  background: #f9f9f9;
  border: 1px solid #eee;
  border-radius: 6px;
  padding: 1rem 1.5rem;
  margin-bottom: 1rem;
  position: relative;
`;

const CommentAuthor = styled.div`
  font-weight: bold;
  color: #555;
  margin-bottom: 0.5rem;
`;

const CommentContentDisplay = styled.div`
  font-size: 0.95rem;
  line-height: 1.5;
  color: #444;
  margin-bottom: 0.5rem;
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
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  font-size: 0.8rem;
  margin-left: 0.5rem;
  &:hover {
    text-decoration: underline;
  }
`;

const PostActionContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const PostDetailPage: React.FC = () => {
  const { boardType, postId: idFromParams } = useParams<{
    boardType: string;
    postId: string;
  }>();
  const postId = Number(idFromParams);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [post, setPost] = useState<PostDetailProps | null>(null);
  const [comments, setComments] = useState<CommentProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingCommentContent, setEditingCommentContent] =
    useState<string>("");

  // ... (이전 코드들)

  const fetchComments = useCallback(
    async (currentPostId: number) => {
      // boardType이 없을 경우를 대비해 유효성 검사를 추가했어!
      if (isNaN(currentPostId) || !boardType) {
        console.error(
          "유효하지 않은 postId 또는 boardType으로 댓글을 불러올 수 없습니다."
        );
        return;
      }
      try {
        // getCommentList에 boardType 파라미터 추가!
        const commentData = await getCommentList(currentPostId, boardType, {
          page: 1,
          limit: 10,
        });
        setComments(commentData);
      } catch (err) {
        console.error("댓글 목록을 불러오는 데 실패했습니다.", err);
      }
    },
    [boardType]
  ); // 의존성 배열에 boardType 추가!

  const fetchPostAndComments = useCallback(async () => {
    if (!boardType || !idFromParams || isNaN(postId)) {
      setError("유효하지 않은 게시물 ID 또는 게시판 종류입니다.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const postData = await getPostDetail(boardType, postId);
      setPost(postData);
      // fetchComments가 boardType을 사용하니, 이 의존성도 자연스럽게 연결돼야겠지?
      await fetchComments(postId);
    } catch (err) {
      console.error("게시물 또는 댓글을 불러오는 데 실패했습니다.", err);
      setError("게시물 또는 댓글을 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, [boardType, idFromParams, postId, fetchComments]);

  useEffect(() => {
    fetchPostAndComments();
  }, [fetchPostAndComments]);

  const handleCommentSubmit = useCallback(
    async (content: string) => {
      // postId와 boardType이 없을 경우를 대비해 유효성 검사!
      if (isNaN(postId) || !boardType) {
        alert(
          "게시물 ID 또는 게시판 종류가 유효하지 않아 댓글을 처리할 수 없습니다."
        );
        return;
      }
      try {
        if (editingCommentId) {
          // updateComment에 boardType과 postId 파라미터 추가!
          await updateComment(boardType, postId, editingCommentId, content);
          alert("댓글이 성공적으로 수정되었습니다.");
        } else {
          // writeComment에 boardType 파라미터 추가!
          await writeComment(postId, boardType, content);
          alert("새 댓글이 성공적으로 작성되었습니다.");
        }
        setEditingCommentId(null);
        setEditingCommentContent("");
        // 댓글 처리 후 목록을 다시 불러올 때도 boardType이 필요하니까 fetchComments 잘 호출!
        await fetchComments(postId);
      } catch (err) {
        console.error("댓글 처리 중 오류 발생:", err);
        alert("댓글 처리 중 오류가 발생했습니다.");
      }
    },
    [editingCommentId, postId, fetchComments, boardType]
  ); // 의존성 배열에 boardType 추가!

  // ... (나머지 코드들)

  const handleEditCommentClick = useCallback((comment: CommentProps) => {
    setEditingCommentId(comment.id);
    setEditingCommentContent(comment.content);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingCommentId(null);
    setEditingCommentContent("");
  }, []);

  // ⭐️ 게시물 수정 핸들러 추가
  const handleEditPost = useCallback(() => {
    if (boardType && postId) {
      navigate(`/boards/${boardType}/posts/${postId}/edit`); // 수정 페이지로 이동
    } else {
      alert("게시물 정보를 알 수 없어 수정 페이지로 이동할 수 없습니다.");
    }
  }, [boardType, postId, navigate]);

  const handleDeletePost = useCallback(async () => {
    if (!window.confirm("정말로 이 게시물을 삭제하시겠습니까?")) {
      return;
    }
    if (!boardType || isNaN(postId) || !post?.id) {
      alert("삭제할 게시물의 정보가 유효하지 않습니다.");
      return;
    }
    try {
      await deletePost(boardType, postId);
      alert("게시물이 성공적으로 삭제되었습니다.");
      navigate(`/boards/${boardType}/posts/`);
    } catch (error) {
      console.error("게시물 삭제 실패:", error);
      alert("게시물 삭제에 실패했습니다. 다시 시도해주세요.");
    }
  }, [boardType, postId, post?.id, navigate]);

  const handleDeleteComment = useCallback(
    async (commentId: number) => {
      if (!window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) {
        return;
      }
      // 유효성 검사 추가 (boardType이나 postId가 없으면 진행하지 않도록)
      if (!boardType || isNaN(postId)) {
        alert("게시물 정보가 유효하지 않아 댓글을 삭제할 수 없습니다.");
        return;
      }
      try {
        // deleteComment에 boardType과 postId 파라미터 추가!
        await deleteComment(boardType, postId, commentId);
        alert("댓글이 성공적으로 삭제되었습니다.");
        await fetchComments(postId); // 삭제 후 댓글 목록 다시 불러오기
      } catch (error) {
        console.error("댓글 삭제 실패:", error);
        alert("댓글 삭제에 실패했습니다. 다시 시도해주세요.");
      }
    },
    [postId, fetchComments, boardType] // 의존성 배열에 boardType 추가!
  );

  if (loading) return <PageContainer>게시물과 댓글 로딩 중...</PageContainer>;
  if (error) return <PageContainer>오류: {error}</PageContainer>;
  if (!post) return <PageContainer>게시물을 찾을 수 없습니다.</PageContainer>;

  const isPostAuthor = currentUser && currentUser.id === Number(post.author);

  return (
    <PageContainer>
      <PostActionContainer>
        {isPostAuthor && (
          <>
            <ActionButton onClick={handleEditPost}>수정</ActionButton>{" "}
            {/* ⭐️ 수정 버튼 연결 */}
            <ActionButton onClick={handleDeletePost}>삭제</ActionButton>
          </>
        )}
      </PostActionContainer>

      <PostTitle>{post.title}</PostTitle>
      <PostMeta>
        작성자: {post.author || "익명"} | 작성일:{" "}
        {new Date(post.createdAt || "").toLocaleDateString()}
      </PostMeta>
      <PostContent dangerouslySetInnerHTML={{ __html: post.content }} />

      <CommentSectionTitle>댓글</CommentSectionTitle>
      <CommentEditor
        initialContent={editingCommentContent}
        onCommentSubmit={handleCommentSubmit}
        onCancel={editingCommentId ? handleCancelEdit : undefined}
        submitButtonText={editingCommentId ? "댓글 수정 완료" : "댓글 작성"}
      />

      <CommentListContainer>
        {comments.length === 0 ? (
          <p>아직 댓글이 없습니다.</p>
        ) : (
          comments.map((comment) => (
            <CommentItem key={comment.id}>
              <CommentActions>
                {currentUser && currentUser.id === Number(comment.author) && (
                  <>
                    <ActionButton
                      onClick={() => handleEditCommentClick(comment)}
                    >
                      수정
                    </ActionButton>
                    <ActionButton
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      삭제
                    </ActionButton>
                  </>
                )}
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
