import { Inject, Service } from "fastify-decorators";
import ServiceClass, { serviceClassToken } from "../common/serviceClass";
import { BadRequestError } from "../../../server/utils/common/errors/error";
import { Tables } from "../../../db/types/tables";
import { LibraryColumns } from "../../../db/types/tableColumns/library";

export const libraryManagerToken = Symbol("libraryManagerToken");

@Service(libraryManagerToken)
export default class LibraryManager {
  @Inject(serviceClassToken)
  private _serviceClass!: ServiceClass;

  public async createLibrary(libraryData: {
    name: string;
    description: string;
    owner_id: number;
  }): Promise<any> {
    const library = await this._serviceClass.createRecord({
      tableName: Tables.libraries,
      columnObject: libraryData,
    });
    return library.rows[0];
  }

  public async getLibrary(id: number) {
    const library = await this._serviceClass.getRecord({
      tableName: Tables.libraries,
      searchBy: LibraryColumns.id,
      value: id,
    });
    if (!library.rows.length) {
      throw new BadRequestError(
        `Library with id ${id} not found`,
        "LibraryManager"
      );
    }
    return library.rows[0];
  }
}
