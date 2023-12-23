import axios, {
  AxiosInstance,
  AxiosResponse,
  CreateAxiosDefaults,
  InternalAxiosRequestConfig,
} from "axios";
import * as rTracer from "cls-rtracer";

export default class AxiosInterceptor<T, K> {
  private instance: AxiosInstance;
  private interceptors: number[];

  constructor(instanceConfig?: CreateAxiosDefaults) {
    this.instance = axios.create(instanceConfig);
    this.interceptors = [];

    // Interceptors registration
    this.registerInterceptors();
  }

  private registerInterceptors() {
    this.interceptors.push(
      this.instance.interceptors.request.use(
        (config: InternalAxiosRequestConfig<T>) => {
          // Logic before sending request
          if (!config.headers["x-request-id"]) {
            config.headers["x-request-id"] = rTracer.id();
          }
          return config;
        },
        (error) => {
          // Request error handling logic
          return Promise.reject(error);
        }
      )
    );

    this.interceptors.push(
      this.instance.interceptors.response.use(
        (response: AxiosResponse<T, K>) => {
          // Logic after receiving a successful response
          return response;
        },
        (error) => {
          // Response error handling logic
          return Promise.reject(error);
        }
      )
    );
  }

  public unregisterInterceptors() {
    this.interceptors.forEach((interceptorId) => {
      this.instance.interceptors.request.eject(interceptorId);
    });

    this.interceptors.forEach((interceptorId) => {
      this.instance.interceptors.response.eject(interceptorId);
    });
  }

  public getInstance(): AxiosInstance {
    return this.instance;
  }
}
