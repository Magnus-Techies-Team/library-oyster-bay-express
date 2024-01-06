import { FastifyReply, FastifyRequest } from "fastify";
import { Controller, GET, Inject, POST } from "fastify-decorators";
import {
  RouteGenericInterfaceCreateLibrary,
  RouteGenericInterfaceGetLibrary,
} from "../types/reqInterface";
import { verifyJWTHook } from "../../utils/users/verifyJWTHook";
import LibraryManager, {
  libraryManagerToken,
} from "../../utils/library/libraryManager";
import { authorizeUserHook } from "../../utils/RBAC/hooks/authorizeUserHook";

@Controller("/library")
export class UserController {
  @Inject(libraryManagerToken)
  private _libraryManagerService!: LibraryManager;

  @POST("/", { preHandler: [verifyJWTHook, authorizeUserHook] })
  public async createLibrary(
    req: FastifyRequest<RouteGenericInterfaceCreateLibrary>,
    rep: FastifyReply
  ): Promise<FastifyReply> {
    const library = await this._libraryManagerService.createLibrary(req.body);
    return rep.status(200).send(library);
  }

  @GET("/", { preHandler: [verifyJWTHook, authorizeUserHook] })
  public async getLibrary(
    req: FastifyRequest<RouteGenericInterfaceGetLibrary>,
    rep: FastifyReply
  ): Promise<FastifyReply> {
    const library = await this._libraryManagerService.getLibrary(req.query.id);
    return rep.status(200).send(library);
  }

  @POST("/users/add", { preHandler: [verifyJWTHook, authorizeUserHook] })
  public async addUserToLibrary(
    req: FastifyRequest<RouteGenericInterfaceCreateLibrary>,
    rep: FastifyReply
  ): Promise<FastifyReply> {
    const library = await this._libraryManagerService.createLibrary(req.body);
    return rep.status(200).send(library);
  }
}
