export interface CurrentUser {
  id: number;
  email: string;
}

export function decodeJwt(token: string): CurrentUser | null {
  try {
    const base64Url = token.split('.')[1]; 
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    const payload = JSON.parse(jsonPayload);
    

    const userId = payload.user_id || payload.sub; 
    const userEmail = payload.email; 

    if (userId && userEmail) {
      return { id: Number(userId), email: String(userEmail) }; 
    }
    return null;
  } catch (e) {
    console.error("JWT 디코딩 실패:", e);
    return null;
  }
}