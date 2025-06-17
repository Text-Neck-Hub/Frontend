import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const Card = styled.div`
  background: #fff;
  padding: 3rem 2.5rem;
  border-radius: 1.5rem;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #222;
`;

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

export const LoginPage: React.FC = () => {
  const handleGoogleLogin = () => {
    // 실제 구글 OAuth2.0 URL로 리다이렉트
    window.location.href =
      'https://accounts.google.com/o/oauth2/v2/auth?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=token&scope=profile email&prompt=select_account';
  };

  return (
    <Container>
      <Card>
        <Title>Sign in to Your Account</Title>
        <GoogleButton as="button" onClick={handleGoogleLogin}>
          <GoogleIcon src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
          Sign in with Google
        </GoogleButton>
      </Card>
    </Container>
  );
};

export const GoogleLoginButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <GoogleButton as="button" onClick={onClick}>
    <GoogleIcon src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
    Sign in with Google
  </GoogleButton>
);

// (이 파일은 더 이상 사용되지 않으므로 삭제해도 무방합니다)
