import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import styled from "styled-components";

import { LoginPage } from "./pages/LoginPage";
import { BoardSelectionPage } from "./pages/board/BoardSelectionPage";
import { AngleDetectPage } from "./pages/AngleDetectPage";
import { WebRTCPage } from "./pages/WebRTCPage";
import { AuthCallbackPage } from "./pages/AuthCallbackPage";
import "./App.css";
import { PostListPage } from "./pages/board/free/PostListPage";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { removeAccessTokenAndInfo } from "./services/useAuth";
import PostDetailPage from "./pages/board/free/PostDetailPage";
import { deleteRefreshToken } from "./apis/auth";
import PostEditorPage from "./pages/board/free/PostEditorPage";
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

const StyledNavLink = styled(Link)`
  ${CommonNavLinkStyle}
`;

const StyledNavButton = styled.button`
  ${CommonNavLinkStyle}
`;

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/boards" element={<BoardSelectionPage />} />
          <Route path="/boards/:boardType/posts/" element={<PostListPage />} />
          <Route
            path="/boards/:boardType/posts/new/"
            element={<PostEditorPage />}
          />
          <Route
            path="/boards/:boardType/posts/:postId/"
            element={<PostDetailPage />}
          />
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

  const handleLogout = async () => {
    logout();

    try {
      await deleteRefreshToken();
      console.log("로그아웃 요청 성공!");
      navigate("/");
    } catch (error) {
      console.error("로그아웃 요청 실패:", error);
      alert("로그아웃 요청에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      removeAccessTokenAndInfo();
    }
  };

  return (
    <nav style={{ padding: "1rem", display: "flex", gap: "1rem" }}>
      <StyledNavLink to="/">Home</StyledNavLink>
      <StyledNavLink to="/boards">Board</StyledNavLink>
      <StyledNavLink to="/angle">AngleDetect</StyledNavLink>
      <StyledNavLink to="/webrtc">WebRTC</StyledNavLink>

      {isLoggedIn ? (
        <StyledNavButton onClick={handleLogout}>Logout</StyledNavButton>
      ) : (
        <StyledNavLink to="/login">Login</StyledNavLink>
      )}
    </nav>
  );
};

const Home: React.FC = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "4rem" }}>
      <h1>Welcome Home</h1>
      <p>Go to Login to start Google OAuth2.0</p>
    </div>
  );
};

export default App;
