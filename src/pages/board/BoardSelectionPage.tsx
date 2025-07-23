import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { type Board } from "../../types/Board";
import { getBoardList } from "../../apis/board";

const PageContainer = styled.div`
  max-width: 800px;
  margin: 3rem auto;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  color: #343a40;
  margin-bottom: 2.5rem;
  font-weight: bold;
`;

const BoardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  justify-content: center;
`;

const BoardCard = styled.div`
  background: #ffffff;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  }
`;

const CardTitle = styled.h2`
  font-size: 1.5rem;
  color: #007bff;
  margin-bottom: 0.8rem;
`;

const CardDescription = styled.p`
  font-size: 1rem;
  color: #6c757d;
  line-height: 1.5;
`;

const StatusMessage = styled.p`
  font-size: 1.2rem;
  color: #6c757d;
  margin-top: 2rem;
`;

export const BoardSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getBoardList();
        setBoards(data);
      } catch (err) {
        console.error("게시판 목록을 가져오는 데 실패했습니다:", err);
        setError("게시판 목록을 불러오는 데 실패했습니다. 다시 시도해주세요.");
      } finally {
        setLoading(false);
      }
    };

    fetchBoards();
  }, []);

  const handleBoardSelect = (slug: string) => {
    navigate(`/boards/${slug}/posts`);
  };

  if (loading) {
    return (
      <PageContainer>
        <PageTitle>게시판을 선택해주세요!</PageTitle>
        <StatusMessage>게시판 목록을 불러오는 중입니다...</StatusMessage>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <PageTitle>게시판을 선택해주세요!</PageTitle>
        <StatusMessage style={{ color: "red" }}>{error}</StatusMessage>
      </PageContainer>
    );
  }

  if (boards.length === 0) {
    return (
      <PageContainer>
        <PageTitle>게시판을 선택해주세요!</PageTitle>
        <StatusMessage>표시할 게시판이 없습니다.</StatusMessage>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageTitle>게시판을 선택해주세요!</PageTitle>
      <BoardGrid>
        {boards.map((board) => (
          <BoardCard
            key={board.slug}
            onClick={() => handleBoardSelect(board.slug)}
          >
            <CardTitle>{board.name}</CardTitle>
            <CardDescription>{board.description}</CardDescription>
          </BoardCard>
        ))}
      </BoardGrid>
    </PageContainer>
  );
};
