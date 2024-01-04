import { Inject, Service } from "fastify-decorators";
import { DB, DBToken } from "../../../../db";
import { RbacSchema } from "../../../../db/types/tableSchemas/rbacSchema";
import { getAccessLevel } from "./dbQueries";
import { QueryResult } from "pg";
import { RoleSchema } from "../../../../db/types/tableSchemas/roleSchema";

export const accessManagerToken = Symbol("accessManagerToken");

@Service(accessManagerToken)
export default class AccessManager {
  @Inject(DBToken)
  private _DB!: DB;

  public async getAccessLevel(
    userId: number,
    organizationId: number
  ): Promise<QueryResult<RbacSchema & RoleSchema>> {
    return await this._DB.executeQuery(
      getAccessLevel(userId, organizationId),
      []
    );
  }
}
