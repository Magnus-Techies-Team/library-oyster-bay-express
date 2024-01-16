import { FastifyReply, FastifyRequest } from "fastify";
import { Controller, GET, Inject, POST } from "fastify-decorators";
import {
  RouteGenericInterfaceChangePublicationState,
  RouteGenericInterfaceCreatePublication,
  RouteGenericInterfaceGetOrganizationPublications,
  RouteGenericInterfaceGetPublicationContent,
} from "../types/reqInterface";
import { verifyJWTHook } from "../../utils/users/verifyJWTHook";
import ArticleManager, {
  articleManagerToken,
} from "../../utils/article/articleManager";
import { _CONTENT_TYPE } from "../../utils/article/formatContentTypes";
import { authorizeUserHook } from "../../utils/RBAC/hooks/authorizeUserHook";
import AsyncStorage from "../../utils/RBAC/asyncStorage";

@Controller("/publications")
export class ArticleController {
  @Inject(articleManagerToken)
  private _articleManagerService!: ArticleManager;

  @POST("/", { preHandler: [verifyJWTHook, authorizeUserHook] })
  public async createArticle(
    req: FastifyRequest<RouteGenericInterfaceCreatePublication>,
    rep: FastifyReply
  ): Promise<FastifyReply> {
    const parts = await req.parts();
    const publication = await this._articleManagerService.createPublication({
      parts,
      user_id: AsyncStorage.get("userId"),
      library_id: AsyncStorage.get("organizationId"),
    });
    return rep.status(200).send(publication);
  }

  @POST("/publish", { preHandler: [verifyJWTHook, authorizeUserHook] })
  public async publishPublication(
    req: FastifyRequest<RouteGenericInterfaceChangePublicationState>,
    rep: FastifyReply
  ): Promise<FastifyReply> {
    const publication = await this._articleManagerService.makePublicationPublic(
      req.body.id
    );
    return rep.status(200).send(publication);
  }

  @POST("/approve", { preHandler: [verifyJWTHook, authorizeUserHook] })
  public async approvePublication(
    req: FastifyRequest<RouteGenericInterfaceChangePublicationState>,
    rep: FastifyReply
  ): Promise<FastifyReply> {
    const publication = await this._articleManagerService.approvePublication(
      req.body.id
    );
    return rep.status(200).send(publication);
  }

  @GET("/:id", { preHandler: [verifyJWTHook, authorizeUserHook] })
  public async getArticle(
    req: FastifyRequest<RouteGenericInterfaceGetOrganizationPublications>,
    rep: FastifyReply
  ): Promise<FastifyReply> {
    const publication = await this._articleManagerService.getPublication(
      req.params.id
    );
    return rep.status(200).send(publication);
  }

  @GET("/library", { preHandler: [verifyJWTHook, authorizeUserHook] })
  public async getAllArticles(
    req: FastifyRequest<RouteGenericInterfaceGetOrganizationPublications>,
    rep: FastifyReply
  ): Promise<FastifyReply> {
    const publications =
      await this._articleManagerService.getOrganizationPublications();
    return rep.status(200).send(publications);
  }

  @GET("/download/:id", { preValidation: [verifyJWTHook, authorizeUserHook] })
  public async downloadArticle(
    req: FastifyRequest<RouteGenericInterfaceGetPublicationContent>,
    rep: FastifyReply
  ) {
    const fileContent = await this._articleManagerService.getArticleContent(
      req.params.id
    );
    const contentType = _CONTENT_TYPE[fileContent.format];
    rep.header("Content-Type", contentType).send(fileContent.content);
  }
}
