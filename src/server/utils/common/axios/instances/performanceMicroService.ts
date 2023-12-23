import { AxiosInstance, AxiosResponse, CreateAxiosDefaults } from "axios";
import AxiosInterceptor from "../interceptors";
import { IProductionItem } from "~utils/common/axios/interfaces/interfaces";
import {
  IProductionItemResponseSchema,
  IProductionItemsResponseSchema,
  IProductionThresholdResponseSchema,
  IShiftResponseSchema,
  ProductionThreshold,
} from "@techiosoft/siu";
export default class PerformanceMicroServiceInstance {
  private instance: AxiosInstance;

  constructor(config?: CreateAxiosDefaults) {
    const interceptor = new AxiosInterceptor(config);
    this.instance = interceptor.getInstance();
  }

  public getPublicInstance(): AxiosInstance {
    return this.instance;
  }

  public async createProductionThresholds(
    data: ProductionThreshold[]
  ): Promise<AxiosResponse<IProductionThresholdResponseSchema[]>> {
    return await this.instance.post("/productionThreshold", data);
  }

  public async updateProductionThreshold(
    data: ProductionThreshold,
    productionThresholdId: string
  ): Promise<AxiosResponse<IProductionThresholdResponseSchema>> {
    return await this.instance.patch(
      `/productionThreshold/${productionThresholdId}`,
      data
    );
  }

  public async deleteProductionThreshold(
    productionThresholdId: string
  ): Promise<AxiosResponse<IProductionThresholdResponseSchema>> {
    return await this.instance.delete(
      `/productionThreshold/${productionThresholdId}`
    );
  }

  public async createProductionItems(
    data: IProductionItem[]
  ): Promise<AxiosResponse<IProductionItemsResponseSchema[]>> {
    return await this.instance.post("/productionItem", data);
  }
  public async deleteProductionItem(
    productionItemId: string
  ): Promise<AxiosResponse<IProductionItemResponseSchema>> {
    return await this.instance.delete(`/productionItem/${productionItemId}`);
  }

  public async getFilteredProductionItems(
    station_id: IShiftResponseSchema["station_id"],
    start_date: IShiftResponseSchema["start_date"],
    end_date: IShiftResponseSchema["end_date"]
  ): Promise<AxiosResponse<IProductionItemsResponseSchema[]>> {
    return await this.instance.get("/productionItem", {
      params: { station_id, start_date, end_date },
    });
  }
}
