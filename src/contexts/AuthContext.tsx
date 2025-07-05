
import { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react'; 


interface AuthContextType {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode; 
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const login = () => {
    setIsLoggedIn(true);
    console.log('로그인 성공! 🥳');
  };

  const logout = () => {
    setIsLoggedIn(false);
    console.log('로그아웃 성공! 👋');
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
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