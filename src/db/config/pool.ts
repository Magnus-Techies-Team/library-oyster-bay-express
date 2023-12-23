import { Pool } from "pg";
import _CONFIG from "../../config";

class PgPool {
  private _generalPool?: Pool;

  public getPool() {
    if (!this._generalPool) {
      this._generalPool = new Pool({
        ..._CONFIG.db.pg,
        max: 100,
        ssl: process.env.PGSSLMODE
          ? {
              rejectUnauthorized: false,
            }
          : undefined,
        idleTimeoutMillis: 5000,
        maxUses: 15000,
      });
    }
    return this._generalPool;
  }
}

export default PgPool;
