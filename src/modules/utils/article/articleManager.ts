import { Inject, Service } from "fastify-decorators";
import ServiceClass, { serviceClassToken } from "../common/serviceClass";
import { BadRequestError } from "../../../server/utils/common/errors/error";
import { Tables } from "../../../db/types/tables";
import { PublicationColumns } from "../../../db/types/tableColumns/publication";
import {
  ArticleStorageManager,
  articleStorageManagerToken,
} from "./articleStorage";

export const articleManagerToken = Symbol("articleManagerToken");

@Service(articleManagerToken)
export default class ArticleManager {
  @Inject(serviceClassToken)
  private _serviceClass!: ServiceClass;
  @Inject(articleStorageManagerToken)
  private _articleStorageManager!: ArticleStorageManager;

  public async createArticle(
    articleData: {
      title: PublicationColumns.title;
      user_id: PublicationColumns.user_id;
      price: PublicationColumns.price;
      is_public: PublicationColumns.is_public;
      year: PublicationColumns.year;
      library_id: PublicationColumns.library_id;
    },
    content: any
  ): Promise<any> {
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
}
