// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import styled from "styled-components";
// import axios from "axios";
// import { useAuth } from "../contexts/AuthContext";
// import { getAccessToken } from "../apis/auth";
// import type { JWT } from "../types/Jwt";
// import { setAuthInfo } from "../services/useAuth";
// const Container = styled.div`
//   min-height: 100vh;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
//   background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
//   color: #222;
// `;

// const Message = styled.p`
//   font-size: 1.5rem;
//   margin-bottom: 1rem;
// `;

// export const AuthCallbackPage: React.FC = () => {
//   const navigate = useNavigate();
//   const { login } = useAuth();

//   useEffect(() => {
//     const handleAuthCallback = async () => {
//       try {
//         const jwt: JWT = await getAccessToken();
//         console.log(jwt);
//         setAuthInfo(jwt);
//         login();

//         navigate("/");
//       } catch (error: any) {
//         console.error("인증 콜백 처리 중 에러 발생:", error);

//         let errorMessage = "인증 실패";
//         if (axios.isAxiosError(error) && error.response) {
//           errorMessage = error.response.data.error || error.response.statusText;
//         } else {
//           errorMessage = error.message;
//         }
//         navigate("/login?error=" + encodeURIComponent(errorMessage));
//       }
//     };

//     handleAuthCallback();
//   }, [navigate, login]);

//   return (
//     <Container>
//       <Message>로그인 처리 중입니다... ⏳</Message>
//       <Message>잠시만 기다려 주세요.</Message>
//     </Container>
//   );
// };
// src/pages/AuthCallbackPage.tsx

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { getAccessToken } from "../apis/auth"; // ⭐️ getAccessToken은 JWT 객체를 반환한다고 가정
import { setAuthInfo } from "../services/useAuth"; // ⭐️ setAuthInfo는 JWT를 localStorage에 저장한다고 가정
import { decodeJwt } from "../utils/token"; // ⭐️ utils에서 decodeJwt 임포트!

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
  const { login } = useAuth(); // login 함수 가져오기

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // getAccessToken 함수는 액세스 토큰 문자열을 포함하는 객체를 반환한다고 가정
        // (예: { accessToken: "...", refreshToken: "..." })
        const jwt = await getAccessToken(); 
        console.log(jwt);

        // JWT 객체를 로컬 스토리지에 저장하는 서비스 호출
        setAuthInfo(jwt); 

        // ⭐️ 액세스 토큰 문자열을 decodeJwt 함수에 전달하여 사용자 정보 추출
        const userData = decodeJwt(jwt.access); 

        if (userData) {
          // ⭐️ 추출한 사용자 정보를 login 함수에 전달
          login(userData); 
          navigate("/"); // 성공 시 홈으로 이동
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
  }, [navigate, login]); // 의존성 배열에 login 추가 (변경 시 재실행)

  return (
    <Container>
      <Message>로그인 처리 중입니다... ⏳</Message>
      <Message>잠시만 기다려 주세요.</Message>
    </Container>
  );
};