import React from 'react';
import styled from 'styled-components';

const GoogleButton = styled.a`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #fff;
  color: #222;
  border: 1px solid #e0e0e0;
  border-radius: 2rem;
  padding: 0.75rem 2rem;
  font-size: 1.1rem;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(60, 64, 67, 0.08);
  cursor: pointer;
  transition: box-shadow 0.2s, border 0.2s;
  text-decoration: none;
  &:hover {
    box-shadow: 0 4px 16px rgba(60, 64, 67, 0.15);
    border: 1px solid #4285f4;
  }
`;

const GoogleIcon = styled.img`
  width: 24px;
  height: 24px;
`;

export const GoogleLoginButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <GoogleButton as="button" onClick={onClick}>
    <GoogleIcon src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
    Sign in with Google
  </GoogleButton>
);
