// src/contexts/AuthContext.tsx

import { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react'; 
import { decodeJwt, type CurrentUser } from '../utils/token'; // ⭐️ utils에서 decodeJwt와 CurrentUser 임포트!

// CurrentUser 인터페이스는 이제 utils/jwtDecode.ts에서 임포트되므로 여기서 재정의 필요 없어.
// (위에 임포트할 때 같이 가져왔다고 가정!)

interface AuthContextType {
  isLoggedIn: boolean;
  currentUser: CurrentUser | null;
  login: (userData: CurrentUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode; 
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  const login = (userData: CurrentUser) => {
    setIsLoggedIn(true);
    setCurrentUser(userData);
    console.log('로그인 성공! 🥳', userData);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem('accessToken');
    console.log('로그아웃 성공! 👋');
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const decodedUser = decodeJwt(token); // ⭐️ 임포트한 decodeJwt 사용!
      if (decodedUser && decodedUser.id && decodedUser.email) {
        setIsLoggedIn(true);
        setCurrentUser(decodedUser);
        console.log("로그인 정보 복원 성공:", decodedUser);
      } else {
        console.error("토큰은 있지만 사용자 정보 복원 실패. 로그아웃 처리합니다.");
        logout();
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth는 AuthProvider 안에서 사용해야 해! 🚨');
  }
  return context;
};