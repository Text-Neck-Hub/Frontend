import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { getAccessToken } from "../apis/auth";
import type { JWT } from "../types/auth";
import { setAuthInfo } from "../services/useAuth";
const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  color: #222;
`;

const Message = styled.p`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

export const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const jwt: JWT = await getAccessToken();
        if (!jwt || !jwt.accessToken || !jwt.userInfo) {
          throw new Error("인증 정보가 유효하지 않습니다.");
        }
        setAuthInfo(jwt);
        login();

        navigate("/");
      } catch (error: any) {
        console.error("인증 콜백 처리 중 에러 발생:", error);

        let errorMessage = "인증 실패";
        if (axios.isAxiosError(error) && error.response) {
          errorMessage = error.response.data.error || error.response.statusText;
        } else {
          errorMessage = error.message;
        }
        navigate("/login?error=" + encodeURIComponent(errorMessage));
      }
    };

    handleAuthCallback();
  }, [navigate, login]);

  return (
    <Container>
      <Message>로그인 처리 중입니다... ⏳</Message>
      <Message>잠시만 기다려 주세요.</Message>
    </Container>
  );
};
