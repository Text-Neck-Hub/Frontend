import type {JWT} from '../types/auth';
export const removeAccessTokenAndInfo = () => {
localStorage.removeItem('accessToken'); 
localStorage.removeItem('userInfo');
}
export function setAuthInfo(jwt: JWT) {
    localStorage.setItem('accessToken', jwt.accessToken);
    localStorage.setItem('userInfo', JSON.stringify(jwt.userInfo));
}