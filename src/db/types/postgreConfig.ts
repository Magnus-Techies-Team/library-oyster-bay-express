import { ClientConfig } from "pg";

export interface PostgresConfig extends ClientConfig {
  user: string;
  password: string;
  host: string;
  database: string;
  port: number;
}
