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

  // ⭐️ 여기가 중요! boardType이 undefined일 경우 일찍 리턴해서 컴포넌트 렌더링을 막아!
  if (!boardType) {
    return (
      <PostContainer>
        <p style={{ color: "red" }}>오류: 게시판 종류가 지정되지 않았습니다. URL을 확인해주세요.</p>
      </PostContainer>
    );
  }

  // 이제 이 아래부터는 boardType이 항상 string임을 TypeScript가 보장해줘!
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const params: PaginationParams = { page: 1, limit: 10 };

        // boardType은 이미 string임을 확신할 수 있어!
        const fetchedPosts = await getPostList(boardType, params);

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

    fetchPosts(); // boardType 존재 여부를 이미 위에서 확인했으므로 바로 호출!

  }, [boardType]); // boardType이 변경될 때마다 다시 불러옴.

  const handleWriteNewPost = () => {
    // boardType은 이미 string임을 확신할 수 있어!
    navigate(`/boards/${boardType}/posts/new/`);
  };

  return (
    <PostContainer>
      <h1>{boardType} 목록</h1> {/* boardType은 이제 string이야! */}
      <ButtonContainer>
        <CreateButton onClick={handleWriteNewPost} text="새 글 작성" />
      </ButtonContainer>

      {loading ? (
        <p>게시물 로딩 중...</p>
      ) : error ? (
        <p style={{ color: "red" }}>오류: {error}</p>
      ) : posts.length === 0 ? (
        <p>게시물이 없습니다.</p>
      ) : (
        // ⭐️ 이제 boardType이 string임을 TypeScript가 알고 있어!
        <PostList posts={posts} boardSlug={boardType} />
      )}
    </PostContainer>
  );
};