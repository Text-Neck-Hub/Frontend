
import axios,  {type AxiosInstance,type AxiosResponse, AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../utils/cookie'; 
export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}


const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.textneckhub.p-e.kr', 
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json', 
  },
});


axiosInstance.interceptors.request.use(
   
  (config) => {
    
    const accessToken = localStorage.getItem('accessToken');
    const csrfToken = getCookie('csrftoken'); 
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      config.headers['X-CSRFToken'] = csrfToken;
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
          const refreshResponse = await axios.post('/v2/auth/access-token/refresh/', { refreshToken });
          const newAccessToken = refreshResponse.data.accessToken;
          localStorage.setItem('accessToken', newAccessToken); 
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest); 
        }
      } catch (refreshError) {
        
        const navigate = useNavigate();
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/login', {
          state: { error: '세션이 만료되었습니다. 다시 로그인 해주세요.' },
        });
      }
    }

    return Promise.reject(error); 
  }
);


export default axiosInstance;