import type { JWT } from "../types/Jwt";

export function setAuthInfo(jwt: JWT) {
  localStorage.setItem("accessToken", jwt.access);
  localStorage.setItem("userInfo", JSON.stringify(jwt.user_info));
}
