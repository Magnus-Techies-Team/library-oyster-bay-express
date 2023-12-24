import { AxiosInstance, AxiosResponse, CreateAxiosDefaults } from "axios";
import AxiosInterceptor from "../interceptors";

export default class FirstMicroServiceInstance {
  private instance: AxiosInstance;

  constructor(config?: CreateAxiosDefaults) {
    const interceptor = new AxiosInterceptor(config);
    this.instance = interceptor.getInstance();
  }

  public getPublicInstance(): AxiosInstance {
    return this.instance;
  }

  public async testRoute(query: string): Promise<AxiosResponse> {
    return await this.instance.post("/test", { query });
  }
}
