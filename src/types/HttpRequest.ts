import {type AxiosResponse,type AxiosRequestConfig } from 'axios';

export interface HttpRequest<T = any> {
  url: string;
  method: (url: string, data?: any, config?: AxiosRequestConfig) => Promise<AxiosResponse<T>>;
  data?: any;
  config?: AxiosRequestConfig; 
}