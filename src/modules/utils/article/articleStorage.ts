import { Inject, Service } from "fastify-decorators";
import { DB, DBToken } from "../../../db";
import { mkdir, writeFile, readFile } from 'fs';
import { WrongOperationError } from "../../../server/utils/common/errors/error";

export const articleStorageManagerToken = Symbol('articleStorageManagerToken')

@Service(articleStorageManagerToken)
export class ArticleStorageManager {

    public async uploadArticle(filepath: string, content: any) {
      this.createPath(filepath);
      writeFile(filepath, content, (error: NodeJS.ErrnoException) => {
        throw new WrongOperationError(`Error occurred during uploading file: ${error.message}`, 'ArticleModule')
      });
    }

    private createPath(filepath: string) {
      const dirs = filepath.split('/');
      dirs.pop()
      const dirPath = dirs.join("/")
      mkdir(dirPath, {
        recursive: true,
      }, (error: NodeJS.ErrnoException) => {
        throw new WrongOperationError(`Error occurred during uploading file: ${error.message}`, 'ArticleModule')
      })
    }

    public getFileContent(filepath: string) {
      return {
        format: filepath.split('.').pop(),
        content: readFile(filepath, (error: NodeJS.ErrnoException) => {})
      };
    }
}