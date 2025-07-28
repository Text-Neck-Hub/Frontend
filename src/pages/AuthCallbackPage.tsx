

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { getAccessToken } from "../apis/auth"; 
import { setAuthInfo } from "../services/useAuth";
import { decodeJwt } from "../utils/token"; 

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
       
        const jwt = await getAccessToken(); 
        console.log(jwt);

        
        setAuthInfo(jwt); 

        
        const userData = decodeJwt(jwt.access); 

        if (userData) {
          
          login(userData); 
          navigate("/"); 
        } else {
          console.error("JWT 디코딩 실패 또는 토큰에 사용자 정보 부족.");
          alert("로그인 처리 중 사용자 정보를 읽어올 수 없습니다. 다시 시도해주세요.");
          navigate("/login?error=" + encodeURIComponent("사용자 정보 부족"));
        }
      } catch (error: any) {
        console.error("인증 콜백 처리 중 에러 발생:", error);

        let errorMessage = "인증 실패";
        if (axios.isAxiosError(error) && error.response) {
          errorMessage = error.response.data.error || error.response.statusText || "서버 오류";
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