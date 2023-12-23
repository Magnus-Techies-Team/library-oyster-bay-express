import { ICustomError } from "./errorTypes";
import { ModuleName } from "./error";

export class RestError extends Error {
  public statusCode: number;
  public error: string;
  public message: string;
  public module: string;

  constructor(error: ICustomError, message: string, module: ModuleName) {
    super();
    this.statusCode = error.statusCode;
    this.error = error.errorMessage;
    this.message = message;
    this.module = module;
  }

  get json() {
    return Object.assign({}, this);
  }

  get string() {
    return JSON.stringify(this);
  }
}
