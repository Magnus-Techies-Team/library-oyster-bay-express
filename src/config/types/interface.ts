import { FastifyListenOptions } from "fastify/types/instance";
import { PostgresConfig } from "../../db/types/postgreConfig";
import {
  PinoDestinationStream,
  PinoLoggerOptions,
} from "../../server/utils/logger";

export enum Env {
  prod = "prod",
  dev = "dev",
}
export type EnvTypes = keyof typeof Env;
interface ServerConfig extends FastifyListenOptions {
  host: string;
  port: number;
}
interface LoggerConfig {
  options: PinoLoggerOptions;
  streams?: PinoDestinationStream[];
}

interface ApplicationConfig {
  env: string;
  name: string;
  abbr: string;
  version: string;
  documentation: {
    prefix: string;
  };
  specification?: {
    cron: string;
    generationNumber: number;
  };
  logger: LoggerConfig;
}
export interface Config {
  server: ServerConfig;
  db: {
    pg: PostgresConfig;
  };
  services: {
    example: string;
  };

  app: ApplicationConfig;
}
