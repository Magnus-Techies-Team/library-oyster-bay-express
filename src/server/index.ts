import { bootstrap, getInstanceByToken } from "fastify-decorators";
import { IncomingMessage, Server as httpServer, ServerResponse } from "http";
import { plugin, pluginSet, router, routerSet } from "./types";
import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest,
  RouteOptions,
} from "fastify";
import { SchemaObject } from "ajv";
import fs from "fs";
import { initLocalDatabaseIfNotExists } from "../db/initLocalDatabase";
import { GenericError } from "./utils/common/errors/error";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { RestError } from "./utils/common/errors/restError";
import { AxiosError } from "axios";
import { ErrorsTypes } from "./utils/common/errors/errorTypes";
import { DB, DBToken } from "../db";
import autofillUsersQuery from "../db/autofill/users";
import autofillSubscriptionsQuery from "../db/autofill/subscriptions";
import autofillRolesQuery from "../db/autofill/roles";
import autofillLibrariesQuery from "../db/autofill/libraries";
import autofillRBACQuery from "../db/autofill/rbac";

export default class Server {
  private setOfRouters: routerSet;
  private setOfPlugins: pluginSet;
  private serverInstance: FastifyInstance<
    httpServer,
    IncomingMessage,
    ServerResponse
  >;
  private _referencesSchemasList: SchemaObject[] = [];

  constructor(
    server: FastifyInstance<httpServer, IncomingMessage, ServerResponse>,
    routerSet?: routerSet,
    pluginSet?: pluginSet
  ) {
    this.setOfRouters = routerSet ?? [];
    this.setOfPlugins = pluginSet ?? [];
    this.serverInstance = server;
  }

  public setEnvVariables(envParamsObject: { [key: string]: any }) {
    for (let envParamName in envParamsObject) {
      process.env[envParamName] = envParamsObject[envParamName];
    }
  }

  public registerPlugin(plugin: plugin) {
    this.setOfPlugins.push(plugin);
  }

  public registerRouter(router: router) {
    this.setOfRouters.push(router);
  }

  public registerPlugins() {
    this.setOfPlugins.forEach((plugin: plugin) => {
      this.serverInstance.register(plugin.pluginInstance, plugin.options);
    });
  }

  private registerRouters() {
    this.setOfRouters.forEach((router: router) => {
      let { routes, opts } = router;
      //routes = generalHook.applyGeneralHookRreSerialization(routes);
      const plugin = (
        server: FastifyInstance,
        opts: FastifyPluginOptions,
        done: () => unknown
      ) => {
        routes.forEach((route: RouteOptions) => {
          server.route(route);
        });
        done();
      };
      this.serverInstance.register(plugin, opts);
    });
  }

  public addSchema(schema: SchemaObject) {
    this.serverInstance.addSchema(schema);
  }

  public addSchemas(schemas: SchemaObject[]) {
    if (schemas.length)
      schemas.forEach((schema) => this.serverInstance.addSchema(schema));
  }

  public getSchemas() {
    return this.serverInstance.getSchemas();
  }

  public findReferencesSchemas(
    modulesDirectory = `${process.cwd()}/dist/src/modules`,
    schemasDirectory = "schemas",
    referenceFileName = "reference.js"
  ) {
    const referencesSchemas: SchemaObject[] = [];
    fs.readdirSync(modulesDirectory).map((moduleName) => {
      /* define paths */
      const moduleBasePath = [
        modulesDirectory,
        moduleName,
        schemasDirectory,
      ].join("/");
      const moduleSchemasPath = [moduleBasePath, referenceFileName].join("/");
      /* if module has definition schemas(contains $id property)*/
      if (fs.existsSync(moduleSchemasPath)) {
        /* import all schemas */
        const moduleSchemas: {
          [key: string]: SchemaObject;
        } = require(moduleSchemasPath);
        console.log(`Schemas from ${moduleName}: \n`, moduleSchemas);
        /* filter definition schemas and register them to the server */
        const findedSchemas: SchemaObject[] = Object.values(
          moduleSchemas
        ).filter((schema: SchemaObject) => Object.keys(schema).includes("$id"));
        referencesSchemas.push(...findedSchemas);
        return findedSchemas;
      }
    });
    if (referencesSchemas?.length)
      this._referencesSchemasList = referencesSchemas;
  }

  public addReferencesSchemas(
    putOnStartList: string[] = [],
    ignoreList: string[] = []
  ) {
    let toStartList: SchemaObject[] = [];
    let filteredList: SchemaObject[] = [];
    /* set to array schemas need to put on start */
    toStartList = this._referencesSchemasList.filter(
      (el) => el.$id === putOnStartList.find((childEl) => childEl === el.$id)
    );
    /* filter the rest of the schemas, ignoring those that need to be ignored and those that were added to the start */
    filteredList = this._referencesSchemasList.filter(
      (el) =>
        el.$id !== ignoreList.find((childEl) => childEl === el.$id) &&
        el.$id !== putOnStartList.find((childEl) => childEl === el.$id)
    );
    this._referencesSchemasList = [...toStartList, ...filteredList];
    // console.log("References Schemas List: ", this._referencesSchemasList);
    const list = this._referencesSchemasList;
    if (list.length) list.forEach((schema) => this.addSchema(schema));
  }

  public registerErrorHandler() {
    this.serverInstance.setErrorHandler(
      (error: GenericError, req: FastifyRequest, rep: FastifyReply) => {
        if (!error.info) {
          // Custom error handler for JWT & Swagger
          /** Swagger error instance */
          if (error && error["validation"] && error["validationContext"]) {
            Object.assign(error, {
              info: {
                statusCode: ErrorsTypes.BadRequest.statusCode,
                errorMessage:
                  error.message || ErrorsTypes.BadRequest.errorMessage,
              },
            });
            return rep
              .code(error["info"]["statusCode"])
              .send(
                new RestError(
                  error.info,
                  error["info"]["errorMessage"],
                  "System(Swagger)"
                )
              );
          }
          /** Axios error instance */
          if (error instanceof AxiosError) {
            Object.assign(error, {
              info: {
                statusCode:
                  error?.response?.status ?? ErrorsTypes.ServerError.statusCode,
                errorMessage: Object.keys(error?.response?.data)?.length
                  ? JSON.stringify(error?.response?.data)
                  : error?.response?.statusText,
              },
            });
            return rep
              .code(error["info"]["statusCode"])
              .send(
                new RestError(
                  error.info,
                  error["info"]["errorMessage"],
                  "System(Axios)"
                )
              );
          }
          /** JWT expired error instance */
          if (error instanceof TokenExpiredError) {
            Object.assign(error, {
              info: {
                statusCode: ErrorsTypes.BadRequest.statusCode,
                errorMessage:
                  "Json Web Token expired" ||
                  ErrorsTypes.BadRequest.errorMessage,
              },
            });
            return rep
              .code(error["info"]["statusCode"])
              .send(
                new RestError(
                  error.info,
                  error["info"]["errorMessage"],
                  "System(JWT)"
                )
              );
          }
          /** JWT malformed error instance */
          if (error instanceof JsonWebTokenError) {
            Object.assign(error, {
              info: {
                statusCode: ErrorsTypes.BadRequest.statusCode,
                errorMessage:
                  "Json Web Token malformed" ||
                  ErrorsTypes.BadRequest.errorMessage,
              },
            });
            return rep
              .code(error["info"]["statusCode"])
              .send(
                new RestError(
                  error.info,
                  error["info"]["errorMessage"],
                  "System(JWT)"
                )
              );
          }
          /** Default error instance */
          Object.assign(error, { info: ErrorsTypes.ServerError });
        }
        return rep
          .code(error.info.statusCode)
          .send(new RestError(error.info, error.message, error.module));
      }
    );
  }

  public registerControllers(controllers: any[]) {
    this.serverInstance.register(bootstrap, {
      controllers: controllers,
    });
  }

  public async initServer(port: number, host: string) {
    await this.serverInstance.listen({ port, host });
  }

  public async initLocalDatabase() {
    await initLocalDatabaseIfNotExists();
  }

  public async autofillDatabase() {
    const DB = getInstanceByToken<DB>(DBToken);
    await DB.executeQuery(autofillUsersQuery);
    await DB.executeQuery(autofillSubscriptionsQuery);
    await DB.executeQuery(autofillRolesQuery);
    await DB.executeQuery(autofillLibrariesQuery);
    await DB.executeQuery(autofillRBACQuery);
  }
}
