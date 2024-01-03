import { ErrorsTypes, ICustomError } from "./errorTypes";
import { getPgError } from "./pgErrorGenerator";

export type ModuleName = string;

interface BaseError {
  readonly info: ICustomError;
  readonly module: ModuleName;
}

export class BadRequestError extends Error implements BaseError {
  readonly info = ErrorsTypes.BadRequest;
  constructor(readonly message: string, readonly module: string) {
    super();
  }
}

export class UnauthorizedError extends Error implements BaseError {
  readonly info = ErrorsTypes.Unauthorized;
  constructor(readonly message: string, readonly module: ModuleName) {
    super();
  }
}

export class ForbiddenError extends Error implements BaseError {
  readonly info = ErrorsTypes.Forbidden;
  constructor(readonly message: string, readonly module: ModuleName) {
    super();
  }
}

export class NotAllowedError extends Error implements BaseError {
  readonly info = ErrorsTypes.NotAllowed;
  constructor(readonly message: string, readonly module: ModuleName) {
    super();
  }
}

export class WrongOperationError extends Error implements BaseError {
  readonly info = ErrorsTypes.WrongOperation;
  constructor(readonly message: string, readonly module: ModuleName) {
    super();
  }
}

export class NotFoundError extends Error implements BaseError {
  readonly info = ErrorsTypes.NotFound;
  constructor(readonly message: string, readonly module: ModuleName) {
    super();
  }
}

export class TooManyRequestsError extends Error implements BaseError {
  readonly info = ErrorsTypes.TooManyRequests;
  constructor(readonly message: string, readonly module: ModuleName) {
    super();
  }
}

export class ServerError extends Error implements BaseError {
  readonly info = ErrorsTypes.ServerError;
  constructor(readonly message: string, readonly module: ModuleName) {
    super();
  }
}

export class PostgresError extends Error implements BaseError {
  readonly info = {
    statusCode: Number(ErrorsTypes.ServerError.statusCode),
    errorMessage: "Error while executing query.",
  };
  constructor(
    readonly message: string,
    readonly module: ModuleName,
    code: string
  ) {
    super();
    const pgError = getPgError(code);
    this.info.statusCode = pgError.code;
    this.info.errorMessage = pgError.message;
  }
}

export type GenericError =
  | BadRequestError
  | ForbiddenError
  | WrongOperationError
  | TooManyRequestsError
  | ServerError;
