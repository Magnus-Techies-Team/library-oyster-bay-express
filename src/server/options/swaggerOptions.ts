import { FastifyDynamicSwaggerOptions } from "@fastify/swagger";
import _CONFIG from "../../config";
import logger from "../utils/logger";
export default <FastifyDynamicSwaggerOptions>{
  mode: "dynamic",
  openapi: {
    info: {
      title: _CONFIG.app.name,
      description: `Documentation for ${_CONFIG.app.name} back-end`,
      version: _CONFIG.app.version,
    },
  },
  refResolver: {
    buildLocalReference(
      /** The `json` that is being resolved. */
      json: { $id: string },
      /** The `baseUri` object of the schema. */
      baseUri: {
        scheme?: string;
        userinfo?: string;
        host?: string;
        port?: number | string;
        path?: string;
        query?: string;
        fragment?: string;
        reference?: string;
        error?: string;
      },
      fragment: string,
      i: number
    ) {
      logger.info({ json, baseUri, fragment, i }, "[refResolver Info]: ");
      return json.$id || `${_CONFIG.app.abbr.toLowerCase()}-${i}`;
    },
  },
};
