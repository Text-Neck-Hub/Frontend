import React from 'react';
import styled from 'styled-components';
import { GoogleLoginButton } from '../components/GoogleLoginButton';

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

export const LoginPage: React.FC = () => {
  const handleGoogleLogin = () => {
    window.location.href = 'https://api.textneckhub.p-e.kr/accounts/google/login'; 
  };

  return (
    <Container>
      <Card>
        <Title>Sign in to Your Account</Title>
        <GoogleLoginButton onClick={handleGoogleLogin} />
      </Card>
    </Container>
  );
};
