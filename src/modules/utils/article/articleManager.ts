import { Inject, Service } from "fastify-decorators";
import ServiceClass, { serviceClassToken } from "../common/serviceClass";
import { BadRequestError } from "../../../server/utils/common/errors/error";
import { Tables } from "../../../db/types/tables";
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
  getOrganizationsHiddenPublicationsQuery,
  getOrganizationHiddenPublicationsByUserIdQuery,
  getOrganizationPublicationByIdAndOrganizationQuery,
  getOrganizationPublicationsQuery,
  getUserPublications,
  setPublicationApprovalByIdAndOrganizationQuery,
  setPublicationVisibilityByIdAndOrganizationQuery,
} from "./dbQueries";
import AsyncStorageMap from "../RBAC/asyncStorage";
import { QueryResult } from "pg";

export const articleManagerToken = Symbol("articleManagerToken");

@Service(articleManagerToken)
export default class ArticleManager {
  @Inject(serviceClassToken)
  private _serviceClass!: ServiceClass;
  @Inject(articleStorageManagerToken)
  private _articleStorageManager!: ArticleStorageManager;

  @Inject(DBToken)
  private _DB!: DB;

  @RBACEnforce(AccessLevel.USER)
  public async createPublication(
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

  @RBACEnforce(AccessLevel.MODERATOR)
  public async approvePublication(
    publicationId: number
  ): Promise<PublicationsSchema> {
    const publication = await this.getPublication(publicationId);
    if (publication.is_public)
      throw new BadRequestError(
        "Publication is already public",
        "ArticleManager"
      );
    return await this.setPublicationApproval(publicationId, true);
  }

  @RBACEnforce(AccessLevel.MODERATOR)
  public async makePublicationPublic(
    publicationId: number
  ): Promise<PublicationsSchema> {
    const publication = await this.getPublication(publicationId);
    if (publication.is_public)
      throw new BadRequestError(
        "Publication is already public",
        "ArticleManager"
      );
    return await this.setPublicationApproval(publicationId, true);
  }

  @RBACEnforce(AccessLevel.MODERATOR)
  private async setPublicationVisibility(
    publicationId: number,
    isPublic: boolean
  ) {
    const publication = await this.getPublication(publicationId);
    const organizationId = AsyncStorageMap.get("organizationId");
    if (publication.is_public === isPublic)
      throw new BadRequestError(
        `Publication is already ${isPublic ? "public" : "hidden"}`,
        "ArticleManager"
      );
    const updatedPublication = await this._DB.executeQuery<PublicationsSchema>(
      setPublicationVisibilityByIdAndOrganizationQuery(
        publicationId,
        organizationId,
        isPublic
      )
    );
    return updatedPublication.rows[0];
  }

  @RBACEnforce(AccessLevel.MODERATOR)
  public async setPublicationApproval(
    publicationId: number,
    isApproved: boolean
  ) {
    const publication = await this.getPublication(publicationId);
    const organizationId = AsyncStorageMap.get("organizationId");
    if (publication.is_approved === isApproved)
      throw new BadRequestError(
        `Publication is already ${isApproved ? "approved" : "disapproved"}`,
        "ArticleManager"
      );
    const updatedPublication = await this._DB.executeQuery<PublicationsSchema>(
      setPublicationApprovalByIdAndOrganizationQuery(
        publicationId,
        organizationId,
        isApproved
      )
    );
    return updatedPublication.rows[0];
  }

  public async getPublication(id: number) {
    const organizationId = AsyncStorageMap.get("organizationId");
    const article = await this._DB.executeQuery<PublicationsSchema>(
      getOrganizationPublicationByIdAndOrganizationQuery(id, organizationId)
    );
    if (!article.rows.length) {
      throw new BadRequestError(
        `Article with id ${id} not found`,
        "ArticleManager"
      );
    }
    return article.rows[0];
  }

  @RBACEnforce(AccessLevel.USER)
  public async getArticleContent(id: number) {
    const article = await this.getPublication(id);
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
    const userId = AsyncStorageMap.get("userId");
    let publications: QueryResult<PublicationsSchema>,
      hiddenPublications: QueryResult<PublicationsSchema>;
    publications = await this._DB.executeQuery<PublicationsSchema>(
      getOrganizationPublicationsQuery(organizationId)
    );
    try {
      hiddenPublications = await this._DB.executeQuery<PublicationsSchema>(
        getOrganizationsHiddenPublicationsQuery(userId)
      );
    } catch (error) {
      hiddenPublications = await this._DB.executeQuery<PublicationsSchema>(
        getOrganizationHiddenPublicationsByUserIdQuery(userId)
      );
    }
    return [...publications.rows, ...hiddenPublications.rows];
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
      getOrganizationsHiddenPublicationsQuery(organizationId)
    );
    return articles.rows;
  }
}
