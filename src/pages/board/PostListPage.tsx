import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { PostList } from "../../components/posts/PostList";
import { getPostList } from "../../apis/board";
import { type PostProps } from "../../types/Post";
import type { PaginationParams } from "../../types/PaginationParams";
import { useParams, useNavigate } from "react-router-dom";
import { CreateButton } from "../../components/buttons/Button";

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

  if (!boardType) {
    return (
      <PostContainer>
        <p style={{ color: "red" }}>오류: 게시판 종류가 지정되지 않았습니다. URL을 확인해주세요.</p>
      </PostContainer>
    );
  }

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const params: PaginationParams = { page: 1, limit: 10 };

        const fetchedPosts = await getPostList(boardType, params);

        // API 응답이 배열인지 확실하게 확인하는 방어 코드 추가
        if (Array.isArray(fetchedPosts)) {
          setPosts(fetchedPosts);
        } else {
          console.error("API가 예상치 못한 게시물 데이터 형식을 반환했습니다:", fetchedPosts);
          setPosts([]); // 배열이 아니면 빈 배열로 설정하여 map 오류 방지
          setError("게시물 목록을 불러오는 데 실패했습니다 (데이터 형식 오류).");
        }
      } catch (err) {
        console.error(`게시물 목록 불러오기 실패 (${boardType} 게시판):`, err);
        setError(
          `"${boardType}" 게시판의 게시물 목록을 불러오는 데 실패했습니다.`
        );
        setPosts([]); // 오류 발생 시 posts를 빈 배열로 초기화하여 map 오류 방지
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();

  }, [boardType]);

  const handleWriteNewPost = () => {
    navigate(`/boards/${boardType}/posts/new/`);
  };

  return (
    <PostContainer>
      <h1>{boardType} 목록</h1>
      <ButtonContainer>
        <CreateButton onClick={handleWriteNewPost} text="새 글 작성" />
      </ButtonContainer>

      {loading ? (
        <p>게시물 로딩 중...</p>
      ) : error ? (
        <p style={{ color: "red" }}>오류: {error}</p>
      ) : (
        // PostList 컴포넌트 내부에서 posts가 배열임을 방어하므로 여기서는 직접 넘깁니다.
        // 다만, posts.length === 0 조건은 PostList 내부에서 처리되는 것이 더 자연스러울 수 있습니다.
        // 현재 로직대로 posts가 비어있을 때 "게시물이 없습니다"를 PostListPage에서 처리
        posts.length === 0 ? (
          <p>게시물이 없습니다.</p>
        ) : (
          <PostList posts={posts} boardSlug={boardType} />
        )
      )}
    </PostContainer>
  );
};