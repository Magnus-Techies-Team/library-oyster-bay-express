import { Inject, Service } from "fastify-decorators";
import { DB, DBToken } from "../../../../db";
import { RBACSchema } from "../../../../db/types/tableSchemas/RBACSchema";
import { getAccessLevel } from "./dbQueries";
import { QueryResult } from "pg";
import { RolesSchema } from "../../../../db/types/tableSchemas/rolesSchema";

export const accessManagerToken = Symbol("accessManagerToken");

@Service(accessManagerToken)
export default class AccessManager {
  @Inject(DBToken)
  private _DB!: DB;

  public async getAccessLevel(
    userId: number,
    organizationId: number
  ): Promise<QueryResult<RBACSchema & RolesSchema>> {
    return await this._DB.executeQuery(
      getAccessLevel(userId, organizationId),
      []
    );
  }
}
