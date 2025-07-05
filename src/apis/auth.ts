
import { Http } from '../types/Http'; 
export const getAccessToken = async () => await Http.get('/v2/auth/access-token/');
export const deleteRefreshToken = async () => await Http.delete('/v2/auth/refresh-token/revoke/');