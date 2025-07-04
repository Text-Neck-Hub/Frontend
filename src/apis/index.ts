import axios, { type AxiosInstance, type AxiosResponse, AxiosError } from 'axios';
// import { useNavigate } from 'react-router-dom'; // 👈 여기는 이제 필요 없어!
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
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    const csrfToken = getCookie('csrftoken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      // CSRF 토큰은 GET 요청에는 보내지 않는 것이 일반적이며, POST/PUT/DELETE 등 상태 변경 요청에만 보냄
      // 모든 요청에 X-CSRFToken을 보내도 문제는 없지만, 백엔드 설정에 따라 달라질 수 있음.
      // Django CSRF 미들웨어는 POST/PUT/DELETE 요청에 대해 토큰을 검사함.
      if (config.method !== 'get') {
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

// 전역적으로 내비게이션을 처리해야 할 경우,
// 이 부분에서 직접 navigate를 호출하는 대신,
// 에러를 발생시켜 해당 에러를 처리하는 컴포넌트에서 navigate를 호출하도록 하는 것이 일반적이야.
// 아니면 별도의 전역 이벤트 시스템을 만들어서 처리할 수도 있어.
// 여기서는 에러를 그대로 던져서 컴포넌트가 처리하도록 할게!
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    console.error('응답 인터셉터 에러:', error);

    const originalRequest = error.config;

    // 401 에러이고, 재시도 플래그가 없으며, originalRequest가 유효할 때
    if (error.response?.status === 401 && originalRequest && !(originalRequest as any)._retry) {
      (originalRequest as any)._retry = true; // 재시도 플래그 설정

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          // 🚨 axiosInstance를 사용해서 토큰 갱신 요청을 보내야 해!
          const refreshResponse = await axiosInstance.post('/v2/auth/access-token/refresh/', { refreshToken });
          const newAccessToken = refreshResponse.data.accessToken;

          localStorage.setItem('accessToken', newAccessToken);
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

          // 원래 요청을 새 액세스 토큰으로 재시도
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // 갱신 토큰으로 액세스 토큰 재발급 실패 시 (예: 갱신 토큰 만료 등)
        console.error('인증 콜백 처리 중 에러 발생 (토큰 갱신 실패):', refreshError);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        // 🚨 여기서는 navigate를 직접 호출할 수 없어!
        // 대신, 로그인 페이지로 리다이렉트가 필요하다는 신호를 보내거나,
        // 이 에러를 호출한 컴포넌트에서 직접 처리하도록 에러를 다시 던져야 해.
        // 예를 들어, 전역 이벤트 에미터를 사용하거나,
        // 아니면 그냥 Promise.reject(error)를 통해 에러를 전달하고
        // 각 컴포넌트에서 401 에러를 잡아서 navigate를 호출하는 것이 일반적이야.
        // 현재는 에러를 다시 던져서 호출자에게 알리는 방식으로 처리할게.
      }
    }

    // 다른 모든 에러는 그대로 던져서 호출자(컴포넌트)가 처리하도록 함
    return Promise.reject(error);
  }
);

export default axiosInstance;