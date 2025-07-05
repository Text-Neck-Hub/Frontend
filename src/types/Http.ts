import { type AxiosRequestConfig } from 'axios'; 
import { type HttpRequest } from './HttpRequest'; 
import axiosInstance from '../apis/index'; 

export class Http {
  public static async _request<T = any>(httpRequest: HttpRequest<T>): Promise<T> { 
    const { url, method, data, config } = httpRequest; 

    try {
      const requestConfig: AxiosRequestConfig = {
        ...config, 
      };

      const response = await method(url, data, requestConfig);
      
      return response.data;
    } catch (error) {
      console.error(`요청 실패! URL: ${url}, 메서드:`, method.name || '알 수 없음', error);
      throw error;
    }
  }

  public static async get<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return Http._request<T>({
      url,
      method: axiosInstance.get, 
      data, 
      config,
    });
  }

  public static async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return Http._request<T>({
      url,
      method: axiosInstance.post, 
      data,
      config,
    });
  }

  public static async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return Http._request<T>({
      url,
      method: axiosInstance.put,
      data,
      config,
    });
  }

  public static async delete<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return Http._request<T>({
      url,
      method: axiosInstance.delete,
      data, 
      config,
    });
  }

  public static async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return Http._request<T>({
      url,
      method: axiosInstance.patch,
      data,
      config,
    });
  }
}