import { Pool, QueryResult, QueryResultRow } from "pg";
import { Service } from "fastify-decorators";
import PgPool from "./config/pool";
import { PostgresError } from "../server/utils/common/errors/error";
import logger from "../server/utils/logger";

export const DBToken = Symbol("DBToken");

@Service(DBToken)
export class DB {
  private generalPool: Pool;

  constructor() {
    this.generalPool = new PgPool().getPool();
  }

  public async executeQuery<T extends QueryResultRow>(
    query: string,
    values?: any[]
  ): Promise<QueryResult<T>> {
    try {
      logger.info(`Query Executor Info:\n ${query}`);
      if (values) logger.info(`Query Executor Values:\n ${values}`);
      const result = await this.generalPool.query(query, values);
      return result;
    } catch (error: any) {
      logger.error(error);
      throw new PostgresError(error.message, "DB Module", error.code);
    }
  }
}
