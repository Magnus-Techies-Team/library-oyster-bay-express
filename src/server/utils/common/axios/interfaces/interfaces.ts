import { ThreshConfigType, ProductionThreshold } from "@techiosoft/siu";

export interface IThresholdFromConfig extends ProductionThreshold {
  type?: ThreshConfigType;
}

export interface IProductionItem {
  station_id: string;
  start_date: number;
  end_date: number;
  target_units: number;
  plan_resources: number;
  actual_units?: number;
  actual_resources?: number;
  thresholds?: IThresholdFromConfig[];
}
