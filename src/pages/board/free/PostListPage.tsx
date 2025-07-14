import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { PostList } from "../../../components/posts/PostList";
import { getPostList } from "../../../apis/board";
import { type PostProps } from "../../../types/Post";
import type { PaginationParams } from "../../../types/PaginationParams";
import { useParams, useNavigate } from "react-router-dom";
import { CreateButton } from "../../../components/buttons/Button";

const PostContainer = styled.div`
  max-width: 700px;
  margin: 2rem auto;
  padding: 2rem 1rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.5rem;
`;

export const PostListPage: React.FC = () => {
  const { boardType } = useParams<{ boardType: string }>();
  const navigate = useNavigate();

  const [posts, setPosts] = useState<PostProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const params: PaginationParams = { page: 1, limit: 10 };

        const currentCategory = boardType || "free";

        const fetchedPosts = await getPostList(currentCategory, params);

        setPosts(fetchedPosts);
      } catch (err) {
        console.error(`게시물 목록 불러오기 실패 (${boardType} 게시판):`, err);
        setError(
          `"${boardType}" 게시판의 게시물 목록을 불러오는 데 실패했습니다.`
        );
      } finally {
        setLoading(false);
      }
    };

    if (boardType) {
      fetchPosts();
    } else {
      setError("게시판 종류가 지정되지 않았습니다.");
      setLoading(false);
    }
  }, [boardType]);

  const handleWriteNewPost = () => {
    if (boardType) {
      // 🚨🚨🚨 네가 제안한 /boards/:boardType/posts/new 로 이동! 🚨🚨🚨
      navigate(`/boards/${boardType}/posts/new/`);
    } else {
      alert("게시판 종류를 알 수 없어 새 글을 작성할 수 없습니다.");
    }
  };

  return (
    <PostContainer>
      <h1>{boardType || "게시물"} 목록</h1>
      <ButtonContainer>
        {/* 👈 로그인 여부와 상관없이 항상 글쓰기 버튼이 보이도록 조건 제거! */}
        {/* 👈 불필요한 div 태그 제거! */}
        <CreateButton onClick={handleWriteNewPost} text="새 글 작성" />
      </ButtonContainer>

      {loading ? (
        <p>게시물 로딩 중...</p>
      ) : error ? (
        <p style={{ color: "red" }}>오류: {error}</p>
      ) : posts.length === 0 ? (
        <p>게시물이 없습니다.</p>
      ) : (
        <PostList posts={posts} />
      )}
    </PostContainer>
  );
};
