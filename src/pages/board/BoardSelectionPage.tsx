// src/pages/BoardSelectionPage.tsx
import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

// 게시판 종류 데이터 정의
interface BoardType {
  slug: string;
  name: string;
  description: string;
}

const boardTypes: BoardType[] = [
  {
    slug: "free",
    name: "자유 게시판",
    description: "어떤 이야기든 자유롭게 나누는 공간입니다.",
  },
  {
    slug: "qna",
    name: "질문과 답변",
    description: "궁금한 점을 질문하고 답변을 얻는 곳입니다.",
  },
  {
    slug: "notice",
    name: "공지사항",
    description: "서비스의 중요 소식을 알려드립니다.",
  },
  {
    slug: "tech",
    name: "기술 게시판",
    description: "다양한 개발 기술 정보를 공유하는 곳입니다.",
  },
];

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

export const BoardSelectionPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBoardSelect = (slug: string) => {
    navigate(`/boards/${slug}/posts`);
  };

  return (
    <PageContainer>
      <PageTitle>게시판을 선택해주세요!</PageTitle>
      <BoardGrid>
        {boardTypes.map((board) => (
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
