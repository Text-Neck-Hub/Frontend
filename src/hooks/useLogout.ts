// src/hooks/useLogout.ts
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { deleteRefreshToken } from "../apis/auth";
import { removeAccessTokenAndInfo } from "../services/useAuth";

const useLogout = () => {
  const { logout } = useAuth();
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

  return handleLogout;
};

export default useLogout;
