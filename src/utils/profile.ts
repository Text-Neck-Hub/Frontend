interface JwtPayload {
  email: string;
  exp?: number;
  iat?: number;
}

function decodeJwt<T>(token: string): T {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("올바른 JWT가 아닙니다");
  }

  const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");

  const json = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(json);
}

export function isOwner(email: string): boolean {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    console.error("Access token이 없습니다.");
    return false;
  }

  try {
    const payload = decodeJwt<JwtPayload>(token);
    console.log("Decoded JWT payload:", payload.email);
    console.log("Provided UID:", email);
    console.log("Is owner check:", payload.email == email);
    return payload.email == email;
  } catch (err) {
    console.error("JWT 디코딩 실패", err);
    return false;
  }
}
