import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { getPostDetail, getCommentList, writeComment, updateComment } from "../../apis/board";
import { type PostDetailProps } from "../../types/Post";
import { type CommentProps } from "../../types/Comment";

// --- UI Components (이전과 동일하므로 생략) ---
const PageContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
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
  h1, h2, h3, h4, h5, h6 { margin: 1em 0; }
  p { margin: 0.5em 0; }
  ul, ol { margin-left: 2em; }
  strong { font-weight: bold; }
  em { font-style: italic; }
  a { color: #007bff; text-decoration: none; &:hover { text-decoration: underline; } }
  img { max-width: 100%; height: auto; display: block; margin: 1em auto; }
  blockquote { border-left: 4px solid #ccc; padding-left: 1em; color: #666; margin: 1em 0; }
  pre { background: #f4f4f4; padding: 1em; border-radius: 4px; overflow-x: auto; }
  code { font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace; }
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
const CommentEditor = ({ initialContent, onCommentSubmit, onCancel, submitButtonText }: CommentEditorProps) => {
    const [content, setContent] = useState(initialContent);

    useEffect(() => {
        setContent(initialContent);
    }, [initialContent]);

    const handleSubmit = () => {
        onCommentSubmit(content);
        setContent('');
    };

    return (
        <div>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={5} style={{ width: '100%', marginBottom: '10px' }} />
            <button onClick={handleSubmit}>{submitButtonText}</button>
            {onCancel && <button onClick={onCancel} style={{ marginLeft: '10px' }}>취소</button>}
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

const PostDetailPage: React.FC = () => {
  // ⭐️ URL 파라미터에서 boardType과 postId를 가져와!
  const { boardType, postId: idFromParams } = useParams<{ boardType: string; postId: string }>();
  // 가져온 postId를 숫자로 변환 (이제 idFromParams가 정의되어 있음이 확실해!)
  const postId = Number(idFromParams);

  const [post, setPost] = useState<PostDetailProps | null>(null);
  const [comments, setComments] = useState<CommentProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingCommentContent, setEditingCommentContent] = useState<string>("");

  const fetchComments = async (currentPostId: number) => {
    if (isNaN(currentPostId)) {
        console.error("유효하지 않은 postId로 댓글을 불러올 수 없습니다.");
        return;
    }
    try {
      const commentData = await getCommentList(currentPostId, { page: 1, limit: 10 });
      setComments(commentData);
    } catch (err) {
      console.error("댓글 목록을 불러오는 데 실패했습니다.", err);
    }
  };

  useEffect(() => {
    const fetchPostAndComments = async () => {
      // ⭐️ 이제 idFromParams가 유효한지 검사!
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

        await fetchComments(postId);
      } catch (err) {
        console.error("게시물 또는 댓글을 불러오는 데 실패했습니다.", err);
        setError("게시물 또는 댓글을 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndComments();
  }, [boardType, postId]); 

  const handleCommentSubmit = async (content: string) => {
    if (isNaN(postId)) {
        alert("게시물 ID가 유효하지 않아 댓글을 작성할 수 없습니다.");
        return;
    }
    try {
      if (editingCommentId) {
        await updateComment(editingCommentId, content);
        setEditingCommentId(null);
        setEditingCommentContent("");
        alert("댓글이 성공적으로 수정되었습니다.");
      } else {
        await writeComment(postId, content);
        alert("새 댓글이 성공적으로 작성되었습니다.");
      }
      await fetchComments(postId);
    } catch (err) {
      console.error("댓글 처리 중 오류 발생:", err);
      alert("댓글 처리 중 오류가 발생했습니다.");
    }
  };

  const handleEditClick = (comment: CommentProps) => {
    setEditingCommentId(comment.id);
    setEditingCommentContent(comment.content);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingCommentContent("");
  };

  if (loading) return <PageContainer>게시물과 댓글 로딩 중...</PageContainer>;
  if (error) return <PageContainer>오류: {error}</PageContainer>;
  if (!post) return <PageContainer>게시물을 찾을 수 없습니다.</PageContainer>;

  return (
    <PageContainer>
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
                <ActionButton onClick={() => handleEditClick(comment)}>
                  수정
                </ActionButton>
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