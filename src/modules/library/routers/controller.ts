import { FastifyReply, FastifyRequest } from "fastify";
import { Controller, GET, Inject, POST } from "fastify-decorators";
import {
  RouteGenericInterfaceAddUserToLibrary,
  RouteGenericInterfaceCreateLibrary,
  RouteGenericInterfaceGetLibrary,
} from "../types/reqInterface";
import { verifyJWTHook } from "../../utils/users/verifyJWTHook";
import LibraryManager, {
  libraryManagerToken,
} from "../../utils/library/libraryManager";
import { authorizeUserHook } from "../../utils/RBAC/hooks/authorizeUserHook";

@Controller("/library")
export class LibraryController {
  @Inject(libraryManagerToken)
  private _libraryManagerService!: LibraryManager;

  @POST("/", { preHandler: [verifyJWTHook, authorizeUserHook] })
  public async createLibrary(
    req: FastifyRequest<RouteGenericInterfaceCreateLibrary>,
    rep: FastifyReply
  ): Promise<FastifyReply> {
    const library = await this._libraryManagerService.createLibrary({
      ...req.body,
      owner_id: Number(req.cookies.id),
    });
    return rep.status(200).send(library);
  }

  @GET("/", { preHandler: [verifyJWTHook, authorizeUserHook] })
  public async getLibrary(
    req: FastifyRequest<RouteGenericInterfaceGetLibrary>,
    rep: FastifyReply
  ): Promise<FastifyReply> {
    const library = await this._libraryManagerService.getLibrary(
      req.query.organizationId
    );
    return rep.status(200).send(library);
  }

  @POST("/users/add", { preHandler: [verifyJWTHook, authorizeUserHook] })
  public async addUserToLibrary(
    req: FastifyRequest<RouteGenericInterfaceAddUserToLibrary>,
    rep: FastifyReply
  ): Promise<FastifyReply> {
    const library = await this._libraryManagerService.addUserToLibrary(
      req.body.user_id
    );
    return rep.status(200).send(library);
  }
}
