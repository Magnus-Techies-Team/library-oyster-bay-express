import PinoPretty from "pino-pretty";
import { Config } from "../types/interface";
import * as rTracer from "cls-rtracer";

const devConfig: Config = {
  server: {
    host: "localhost",
    port: 3000,
  },
  db: {
    pg: {
      user: "postgres",
      password: "password",
      host: "localhost",
      database: "clean-db",
      port: 5432,
    },
  },
  services: {
    example: "http://localhost:3001",
  },
  app: {
    env: "dev",
    name: "Smart Insight Platform Schedule Service",
    abbr: "SIP SS",
    version: "1.0.0",
    documentation: {
      prefix: "/docs",
    },
    logger: {
      options: {
        level: "debug",
        mixin() {
          return { xRequestId: rTracer.id() };
        },
      },
      streams: [
        {
          level: "debug",
          stream: PinoPretty({
            translateTime: "HH:MM:ss Z",
            colorize: true,
            sync: true,
            destination: 2,
          }),
        },
      ],
    },
  },
};

export default devConfig;
