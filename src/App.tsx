import useLogout from "./hooks/useLogout"; // ⬅️ 이 줄만 추가!

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import styled from "styled-components";

import Navbar, { type NavLink } from "./components/Navbar";

import { LoginPage } from "./pages/LoginPage";
import { BoardSelectionPage } from "./pages/board/BoardSelectionPage";
import { AngleDetectPage } from "./pages/core/AngleDetectPage";

import { AuthCallbackPage } from "./pages/AuthCallbackPage";
import { PostListPage } from "./pages/board/PostListPage";
import PostDetailPage from "./pages/board/PostDetailPage";
import PostEditorPage from "./pages/board/PostEditorPage";
import ProfilePage from "./pages/ProfilePage";

import { DashBoardPage } from "./pages/core/DashBoardPage";

import { AuthProvider, useAuth } from "./contexts/AuthContext";

const AppContainer = styled.div`
  width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f0f2f5;
  color: #333;
  font-family: "Arial", sans-serif;
`;

const HomeContent = styled.div`
  text-align: center;
  margin-top: 4rem;
  color: #444;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContainer>
          <NavigationContainer />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/boards" element={<BoardSelectionPage />} />
            <Route
              path="/boards/:boardType/posts/"
              element={<PostListPage />}
            />
            <Route
              path="/boards/:boardType/posts/new/"
              element={<PostEditorPage />}
            />
            <Route
              path="/boards/:boardType/posts/:postId/"
              element={<PostDetailPage />}
            />
            <Route
              path="/boards/:boardType/posts/:postId/edit"
              element={<PostEditorPage />}
            />
            <Route path="/core/angle" element={<AngleDetectPage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/core" element={<DashBoardPage />} />
            <Route path="*" element={<div>페이지를 찾을 수 없습니다!</div>} />
          </Routes>
        </AppContainer>
      </Router>
    </AuthProvider>
  );
};

const NavigationContainer: React.FC = () => {
  const { isLoggedIn } = useAuth();

  const handleLogout = useLogout();

  const baseLinks: NavLink[] = [
    { text: "홈", url: "/" },
    { text: "게시판", url: "/boards" },
    { text: "자세분석", url: "/core" },
  ];

  const authLink: NavLink[] = isLoggedIn
    ? [
        { text: "로그아웃", url: "#", onClick: handleLogout },
        { text: "내 프로필", url: "/profile" },
      ]
    : [{ text: "로그인", url: "/login" }];

  const allLinks = [...baseLinks, ...authLink];

  return <Navbar brandName="TextNeckHub" links={allLinks} />;
};

const Home: React.FC = () => {
  return (
    <HomeContent>
      <h1>환영합니다! 👋</h1>
      <p>Google OAuth2.0으로 로그인하여 시작해 보세요!</p>
    </HomeContent>
  );
};

export default App;
