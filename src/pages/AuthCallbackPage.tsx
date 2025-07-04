import { useEffect } from 'react'; // 'React' import 제거하고 'useEffect'만 가져와!
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext'; // AuthContext에서 useAuth 훅 가져오기! ✨

// 스타일드 컴포넌트는 그대로!
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
        const response = await axios.get('/v2/auth/access-token/', {
          withCredentials: true,
        });
        
        const data = response.data;
        const accessToken = data.access;
        const userInfo = data.user_info;
        

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('userInfo', JSON.stringify(userInfo));

        login(); 

        navigate('/'); 
      } catch (error: any) {
        console.error('인증 콜백 처리 중 에러 발생:', error);

        let errorMessage = '인증 실패';
        if (axios.isAxiosError(error) && error.response) {
          errorMessage = error.response.data.error || error.response.statusText;
        } else {
          errorMessage = error.message;
        }
        navigate('/login?error=' + encodeURIComponent(errorMessage));
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