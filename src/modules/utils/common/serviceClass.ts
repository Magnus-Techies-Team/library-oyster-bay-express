
import { DB, DBToken } from "../../../db";
import { Inject, Service } from "fastify-decorators";
import { createRecordType, readRecordType, updateRecordType, deleteRecordType } from "../../../types/crudTypes";
import { constructCreateQueryStringBasedOnParams, constructGetQueryStringBasedOnParams, constructUpdateQueryStringBasedOnParams, constructDeleteQueryStringBasedOnParams } from "./crudHelpers";

export const serviceClassToken = Symbol("serviceClassToken");

@Service(serviceClassToken)
export default class ServiceClass {
  @Inject(DBToken)
  private _DB!: DB;

  async createRecord(data: createRecordType): Promise<any> {
    const { queryString, valuesArray } =
      constructCreateQueryStringBasedOnParams(data);
    return await this._DB.executeQuery(
      queryString,
      valuesArray,
    );
  }

  async getRecord(data: readRecordType): Promise<any> {
    const queryString = constructGetQueryStringBasedOnParams(data);
    return await this._DB.executeQuery(
      queryString,
      [],
    );
  }

  async updateRecord(data: updateRecordType): Promise<any> {
    const { queryString, valuesArray } =
      constructUpdateQueryStringBasedOnParams(data);
    return await this._DB.executeQuery(
      queryString,
      valuesArray,
    );
  }

  async deleteRecord(data: deleteRecordType): Promise<any> {
    const queryString = constructDeleteQueryStringBasedOnParams(data);
    return await this._DB.executeQuery(
      queryString,
      [],
    );
  }
}