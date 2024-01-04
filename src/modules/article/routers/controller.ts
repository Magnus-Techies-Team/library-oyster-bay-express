import { FastifyReply, FastifyRequest } from "fastify";
import { Controller, GET, Inject, POST } from "fastify-decorators";
import {
  RouteGenericInterfaceCreateLibrary,
  RouteGenericInterfaceGetLibrary,
} from "../types/reqInterface";
import { verifyJWTHook } from "../../utils/users/verifyJWTHook";
import _CONFIG from "../../../config";
import LibraryManager, { libraryManagerToken } from "../../utils/library/libraryManager";
import { authorizeUserHook } from "../../utils/RBAC/asyncStorage/enforcementHook";
import ArticleManager, { articleManagerToken } from "../../utils/article/articleManager";
import { _CONTENT_TYPE } from "../../utils/article/formatContentTypes";

@Controller("/article")
export class ArticleController {
  @Inject(articleManagerToken)
  private _articleManagerService!: ArticleManager;

  @POST("/", { preValidation: authorizeUserHook })
  public async createLibrary(
    req: FastifyRequest,
    rep: FastifyReply
  ): Promise<FastifyReply> {
    const library = await this._articleManagerService.createArticle(<any>req.body, await req.file());
    return rep.status(200).send(library);
  }

  @GET("/:id", { preHandler: verifyJWTHook })
  public async getArticle(
    req: FastifyRequest<RouteGenericInterfaceGetLibrary>,
    rep: FastifyReply
  ): Promise<FastifyReply> {
    const article = await this._articleManagerService.getArticle(req.query.id);
    return rep.status(200).send(article);
  }

  @GET("/library/:id", { preHandler: verifyJWTHook })
  public async getAllArticles(
    req: FastifyRequest<RouteGenericInterfaceGetLibrary>,
    rep: FastifyReply
  ): Promise<FastifyReply> {
    const articles = await this._articleManagerService.getAllArticles(req.query.id);
    return rep.status(200).send(articles);
  }

  @GET('/download/:id', { preValidation: verifyJWTHook })
  public async downloadArticle(
    req: FastifyRequest<RouteGenericInterfaceGetLibrary>,
    rep: FastifyReply
  ) {
    const fileContent = await this._articleManagerService.getArticleContent(req.query.id);
    const contentType = _CONTENT_TYPE[fileContent.format];
    rep.header('Content-Type', contentType).send(fileContent.content);
  }

}
