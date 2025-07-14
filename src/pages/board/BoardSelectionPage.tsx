// src/pages/BoardSelectionPage.tsx
import React, { useEffect, useState } from "react"; // 🚨🚨🚨 useEffect와 useState 임포트!
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { type Board } from "../../types/Board";
import { getBoardList } from "../../apis/board";

// 🚨🚨🚨 boards 변수를 컴포넌트 밖으로 빼는 대신, 컴포넌트 안에서 상태로 관리! 🚨🚨🚨

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

// 🚨🚨🚨 로딩 및 에러 메시지 스타일 추가 (선택 사항) 🚨🚨🚨
const StatusMessage = styled.p`
  font-size: 1.2rem;
  color: #6c757d;
  margin-top: 2rem;
`;

export const BoardSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  // 🚨🚨🚨 상태 훅 추가: boards, loading, error 🚨🚨🚨
  const [boards, setBoards] = useState<Board[]>([]); // 초기값은 빈 배열
  const [loading, setLoading] = useState<boolean>(true); // 로딩 상태
  const [error, setError] = useState<string | null>(null); // 에러 메시지

  // 🚨🚨🚨 useEffect 훅을 사용하여 컴포넌트 마운트 시 데이터 가져오기 🚨🚨🚨
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        setLoading(true); // 데이터 가져오기 시작 시 로딩 상태 true
        setError(null); // 이전 에러 메시지 초기화

        const data = await getBoardList(); // 🚨🚨🚨 Promise를 await으로 처리 🚨🚨🚨
        setBoards(data); // 가져온 데이터를 상태에 저장
      } catch (err) {
        console.error("게시판 목록을 가져오는 데 실패했습니다:", err);
        setError("게시판 목록을 불러오는 데 실패했습니다. 다시 시도해주세요."); // 에러 메시지 설정
      } finally {
        setLoading(false); // 데이터 가져오기 완료 (성공/실패 무관) 시 로딩 상태 false
      }
    };

    fetchBoards(); // 함수 호출
  }, []); // 빈 의존성 배열: 컴포넌트가 처음 마운트될 때 한 번만 실행

  const handleBoardSelect = (slug: string) => {
    navigate(`/boards/${slug}/posts`);
  };

  // 🚨🚨🚨 로딩 및 에러 상태에 따른 조건부 렌더링 🚨🚨🚨
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

  // 데이터가 로드되었지만 boards 배열이 비어있을 경우
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
