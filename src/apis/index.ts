import axios, { type AxiosInstance, type AxiosResponse, AxiosError } from 'axios';

import { getCookie } from '../utils/cookie';

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'https://api.textneckhub.p-e.kr',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    const csrfToken = getCookie('csrftoken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      
      if (config.method !== 'get') {
        console.log('CSRF Token (delete):', csrfToken);
        config.headers['X-CSRFToken'] = csrfToken;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    console.error('요청 인터셉터 에러:', error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    console.error('응답 인터셉터 에러:', error);

    const originalRequest = error.config;

   
    if (error.response?.status === 401 && originalRequest && !(originalRequest as any)._retry) {
      (originalRequest as any)._retry = true; 

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          
          const refreshResponse = await axiosInstance.post('/v2/auth/access-token/refresh/', { refreshToken });
          const newAccessToken = refreshResponse.data.accessToken;

          localStorage.setItem('accessToken', newAccessToken);
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

         
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        
        console.error('인증 콜백 처리 중 에러 발생 (토큰 갱신 실패):', refreshError);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        
      }
    }

 
    return Promise.reject(error);
  }
);

export default axiosInstance;