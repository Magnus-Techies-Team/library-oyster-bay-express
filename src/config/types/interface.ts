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
  logger: LoggerConfig;
  platformDirPath: string;
  security: securityConfig;
  services: {
    article: string;
  };
}

interface securityConfig {
  REFRESH_TOKEN_SECRET: string;
  ACCESS_TOKEN_SECRET: string;
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
