
import axiosInstance from './index';

export async function getAccessToken() {
    const response = await axiosInstance.get('/v2/auth/access-token/', {
          withCredentials: true,
            

        });
    return response.data;
}

export async function deleteRefreshToken() {
    const response = await axiosInstance.delete('/v2/auth/refresh-token/revoke/', {
          withCredentials: true,

        });
    return response.data;
}
