import { Env, EnvTypes, Config } from "./types/interface";

const defaultEnv: EnvTypes = Env.dev;

const env = (() => {
  switch (process.env.NODE_ENV) {
    case Env.prod:
      return Env.prod;
    default:
      return defaultEnv;
  }
})();

const _CONFIG: Config = require(`./env/${env}`).default;
export default _CONFIG;
