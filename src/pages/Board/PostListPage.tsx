import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { PostList } from "../../components/posts/PostList";
import { getPostList } from "../../apis/post";
import { type PostProps } from "../../types/Post";
import type { PaginationParams } from "../../types/PaginationParams";

const PostContainer = styled.div`
  max-width: 700px;
  margin: 2rem auto;
  padding: 2rem 1rem;
`;

export const PostListPage: React.FC = () => {
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const params: PaginationParams = { page: 1, limit: 10 };
        const fetchedPosts = await getPostList(params);

        setPosts(fetchedPosts);
      } catch (err) {
        console.error("게시물 목록 불러오기 실패:", err);
        setError("게시물 목록을 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <PostContainer>
        <h1>게시물 목록</h1>
        <p>게시물 로딩 중...</p>
      </PostContainer>
    );
  }

  if (error) {
    return (
      <PostContainer>
        <h1>게시물 목록</h1>
        <p style={{ color: "red" }}>오류: {error}</p>
      </PostContainer>
    );
  }

  return (
    <PostContainer>
      {" "}
      <h1>게시물 목록</h1>
      {posts.length === 0 ? (
        <p>게시물이 없습니다.</p>
      ) : (
        <PostList posts={posts} />
      )}
    </PostContainer>
  );
};
