import { Inject, Service } from "fastify-decorators";
import ServiceClass, { serviceClassToken } from "../common/serviceClass";
import { BadRequestError } from "../../../server/utils/common/errors/error";
import { Tables } from "../../../db/types/tables";
import { PublicationColumns } from "../../../db/types/tableColumns/publications";
import {
  ArticleStorageManager,
  articleStorageManagerToken,
} from "./articleStorage";
import { PublicationsSchema } from "../../../db/types/tableSchemas/publicationsSchema";
import { RBACEnforce } from "../RBAC/hooks/rbacEnforcementHook";
import { AccessLevel } from "../../../db/types/customTypes";
import { DB, DBToken } from "../../../db";
import {
  getAllOrganizationsPublicationsQuery,
  getHiddenOrganizationsPublicationsQuery,
  getOrganizationPublicationsQuery,
  getUserPublications,
} from "./dbQueries";
import AsyncStorageMap from "../RBAC/asyncStorage";

export const articleManagerToken = Symbol("articleManagerToken");

@Service(articleManagerToken)
export default class ArticleManager {
  @Inject(serviceClassToken)
  private _serviceClass!: ServiceClass;
  @Inject(articleStorageManagerToken)
  private _articleStorageManager!: ArticleStorageManager;

  @Inject(DBToken)
  private _DB!: DB;

  public async createArticle(
    articleData: any,
    content: any
  ): Promise<PublicationsSchema> {
    const filepath = `./publications/${articleData.library_id}/${articleData.title}`;
    articleData["filepath"] = filepath;
    const article = await this._serviceClass.createRecord({
      tableName: Tables.publications,
      columnObject: articleData,
    });
    await this._articleStorageManager.uploadArticle(filepath, content);
    return article.rows[0];
  }

  public async getArticle(id: number) {
    const article = await this._serviceClass.getRecord({
      tableName: Tables.publications,
      searchBy: PublicationColumns.id,
      value: id,
    });
    if (!article.rows.length) {
      throw new BadRequestError(
        `Article with id ${id} not found`,
        "ArticleManager"
      );
    }
    return article.rows[0];
  }

  public async getAllArticles(organizationId: number) {
    const article = await this._serviceClass.getRecord({
      tableName: Tables.publications,
      searchBy: PublicationColumns.library_id,
      value: organizationId,
    });
    if (!article.rows.length) {
      throw new BadRequestError(
        `No articles for library wuth id ${organizationId} found`,
        "ArticleManager"
      );
    }
    return article.rows[0];
  }

  public async getArticleContent(id: number) {
    const article = await this.getArticle(id);
    if (!article) {
      throw new BadRequestError(
        `Article with id ${id} not found`,
        "ArticleManager"
      );
    }
    const filepath = article.filepath;
    return this._articleStorageManager.getFileContent(filepath);
  }

  @RBACEnforce(AccessLevel.USER)
  public async getPersonalPublications() {
    const userId = AsyncStorageMap.get("userId");
    const organizationId = AsyncStorageMap.get("organizationId");
    const articles = await this._DB.executeQuery<PublicationsSchema>(
      getUserPublications(userId, organizationId)
    );
    return articles.rows;
  }

  @RBACEnforce(AccessLevel.MODERATOR)
  public async getUserPublications(userId: number) {
    const organizationId = AsyncStorageMap.get("organizationId");
    const articles = await this._DB.executeQuery<PublicationsSchema>(
      getUserPublications(userId, organizationId)
    );
    return articles.rows;
  }

  @RBACEnforce(AccessLevel.USER)
  public async getOrganizationPublications() {
    const organizationId = AsyncStorageMap.get("organizationId");
    const articles = await this._DB.executeQuery<PublicationsSchema>(
      getOrganizationPublicationsQuery(organizationId)
    );
    return articles.rows;
  }

  @RBACEnforce(AccessLevel.MODERATOR)
  public async getAllOrganizationPublications() {
    const organizationId = AsyncStorageMap.get("organizationId");
    const articles = await this._DB.executeQuery<PublicationsSchema>(
      getAllOrganizationsPublicationsQuery(organizationId)
    );
    return articles.rows;
  }

  @RBACEnforce(AccessLevel.MODERATOR)
  public async getHiddenOrganizationPublications() {
    const organizationId = AsyncStorageMap.get("organizationId");
    const articles = await this._DB.executeQuery<PublicationsSchema>(
      getHiddenOrganizationsPublicationsQuery(organizationId)
    );
    return articles.rows;
  }
}
