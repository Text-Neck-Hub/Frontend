// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components'; // styled-components import 추가! ✨

import { LoginPage } from './pages/LoginPage';
import { BoardPage } from './pages/BoardPage';
import { AngleDetectPage } from './pages/AngleDetectPage';
import { WebRTCPage } from './pages/WebRTCPage';
import { AuthCallbackPage } from './pages/AuthCallbackPage';
import './App.css';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import axios from 'axios';
import { getCookie } from './utils/cookie'; // 새로 만든 getCookie 함수 가져오기! ✨
// -----------------------------------------------------------
// ✨ 여기에 스타일드 컴포넌트를 추가할 거야! ✨
// 네비게이션 링크와 버튼에 적용할 공통 스타일을 정의해두자!
const CommonNavLinkStyle = `
  color: #007bff; /* 링크 색상을 좀 더 일반적인 파란색으로 해봤어! */
  text-decoration: none; /* 기본 밑줄 제거 */
  font-size: 1rem;
  padding: 0;
  cursor: pointer; /* 버튼처럼 커서 모양 변경 */
  font-family: inherit; /* 부모 요소의 폰트를 상속받도록 해서 통일감을 줘! */
  background: none; /* 버튼의 기본 배경 제거 */
  border: none; /* 버튼의 기본 테두리 제거 */

  &:hover {
    text-decoration: underline; /* 마우스 올리면 밑줄 생기게 할 수도 있어! */
  }
`;

// Link 컴포넌트를 스타일링한 StyledNavLink
const StyledNavLink = styled(Link)`
  ${CommonNavLinkStyle}
`;

// button 태그를 스타일링한 StyledNavButton
const StyledNavButton = styled.button`
  ${CommonNavLinkStyle}
`;
// -----------------------------------------------------------


const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/board" element={<BoardPage />} />
          <Route path="/angle" element={<AngleDetectPage />} />
          <Route path="/webrtc" element={<WebRTCPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

const Navigation: React.FC = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    const csrfToken = getCookie('csrftoken'); // ✨ 여기가 핵심! ✨
    alert(csrfToken); // 사용자에게 로그아웃 요청 알림
    localStorage.removeItem('accessToken'); 
    localStorage.removeItem('userInfo'); 
    axios.delete('https://api.textneckhub.p-e.kr/v2/auth/refresh-token/revoke/', {
      headers: {
        'X-CSRFToken': csrfToken, // CSRF 토큰을 헤더에 추가해줘야 해! ✨
      },
      withCredentials: true, 
    }).then(() => {
      console.log('로그아웃 요청 성공!');
    }).catch((error) => {
      console.error('로그아웃 요청 실패:', error); 
      alert('로그아웃 요청에 실패했습니다. 다시 시도해 주세요.');
    });
    navigate('/');
  };

  return (
    <nav style={{ padding: '1rem', display: 'flex', gap: '1rem' }}>
      {/* 이제 Link도 StyledNavLink를 사용해서 스타일을 통일해! */}
      <StyledNavLink to="/">Home</StyledNavLink>
      <StyledNavLink to="/board">Board</StyledNavLink>
      <StyledNavLink to="/angle">AngleDetect</StyledNavLink>
      <StyledNavLink to="/webrtc">WebRTC</StyledNavLink>
      
      {isLoggedIn ? (
        // 로그아웃 버튼에도 StyledNavButton을 적용!
        <StyledNavButton onClick={handleLogout}>
          Logout
        </StyledNavButton>
      ) : (
        // 로그인 링크에도 StyledNavLink를 적용!
        <StyledNavLink to="/login">Login</StyledNavLink>
      )}
    </nav>
  );
};

const Home: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '4rem' }}>
      <h1>Welcome Home</h1>
      <p>Go to Login to start Google OAuth2.0</p>
    </div>
  );
};

export default App;