import React from "react";
import styled from "styled-components";

const ButtonColors = {
  create: {
    default: "linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)",
    hover: "linear-gradient(135deg, #66BB6A 0%, #81C784 100%)",
  },
  read: {
    default: "linear-gradient(135deg, #2196F3 0%, #42A5F5 100%)",
    hover: "linear-gradient(135deg, #42A5F5 0%, #64B5F6 100%)",
  },
  update: {
    default: "linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)",
    hover: "linear-gradient(135deg, #FFB74D 0%, #FFCC80 100%)",
  },
  delete: {
    default: "linear-gradient(135deg, #F44336 0%, #EF5350 100%)",
    hover: "linear-gradient(135deg, #EF5350 0%, #E57373 100%)",
  },
  default: {
    default: "linear-gradient(135deg, #6a1b9a 0%, #ab47bc 100%)",
    hover: "linear-gradient(135deg, #ab47bc 0%, #ce93d8 100%)",
  },
};

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
