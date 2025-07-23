import type {JWT} from '../types/Jwt';
export const removeAccessTokenAndInfo = () => {
    localStorage.removeItem('accessToken'); 
    localStorage.removeItem('userInfo');
}


export function setAuthInfo(jwt: JWT) {
    localStorage.setItem('accessToken', jwt.access);
    localStorage.setItem('userInfo', JSON.stringify(jwt.user_info));
}

