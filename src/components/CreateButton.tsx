import React from "react";
import styled from "styled-components";

// 1. 버튼 종류에 따른 색상 팔레트 정의
const ButtonColors = {
  create: {
    default: "linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)", // 초록색 (생성)
    hover: "linear-gradient(135deg, #66BB6A 0%, #81C784 100%)",
  },
  read: {
    default: "linear-gradient(135deg, #2196F3 0%, #42A5F5 100%)", // 파란색 (조회)
    hover: "linear-gradient(135deg, #42A5F5 0%, #64B5F6 100%)",
  },
  update: {
    default: "linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)", // 주황색 (수정)
    hover: "linear-gradient(135deg, #FFB74D 0%, #FFCC80 100%)",
  },
  delete: {
    default: "linear-gradient(135deg, #F44336 0%, #EF5350 100%)", // 빨간색 (삭제)
    hover: "linear-gradient(135deg, #EF5350 0%, #E57373 100%)",
  },
  default: {
    // 기존 보라색을 기본값으로
    default: "linear-gradient(135deg, #6a1b9a 0%, #ab47bc 100%)",
    hover: "linear-gradient(135deg, #ab47bc 0%, #ce93d8 100%)",
  },
};

// 2. StyledButton: 모든 버튼의 공통 스타일 (variant에 따라 색상 변경)
const StyledButton = styled.button<{ variant?: keyof typeof ButtonColors }>`
  padding: 12px 25px;
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  outline: none;

  background: ${({ variant = "default" }) => ButtonColors[variant].default};

  &:hover {
    background: ${({ variant = "default" }) => ButtonColors[variant].hover};
    transform: translateY(-3px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
`;

// 3. BaseButton: 모든 버튼의 공통 로직 (StyledButton을 래핑)
interface BaseButtonProps {
  onClick: () => void;
  text?: string;
  variant?: keyof typeof ButtonColors;
}

const BaseButton: React.FC<BaseButtonProps> = ({ onClick, text, variant }) => {
  return (
    <StyledButton onClick={onClick} variant={variant}>
      {text}
    </StyledButton>
  );
};

// 4. 각 CRUD 버튼 컴포넌트: BaseButton을 재사용하여 특정 기능과 텍스트, 색상 설정
export const CreateButton: React.FC<{ onClick: () => void; text?: string }> = ({
  onClick,
  text = "생성",
}) => <BaseButton onClick={onClick} text={text} variant="create" />;

export const ReadButton: React.FC<{ onClick: () => void; text?: string }> = ({
  onClick,
  text = "조회",
}) => <BaseButton onClick={onClick} text={text} variant="read" />;

export const UpdateButton: React.FC<{ onClick: () => void; text?: string }> = ({
  onClick,
  text = "수정",
}) => <BaseButton onClick={onClick} text={text} variant="update" />;

export const DeleteButton: React.FC<{ onClick: () => void; text?: string }> = ({
  onClick,
  text = "삭제",
}) => <BaseButton onClick={onClick} text={text} variant="delete" />;
