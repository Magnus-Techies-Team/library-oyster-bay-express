export interface ICustomError {
  statusCode: number;
  errorMessage: string;
}

export const ErrorsTypes = {
  BadRequest: {
    key: "BadRequest",
    statusCode: 400,
    errorMessage: "Bad request. Request has wrong format.",
  },
  Unauthorized: {
    key: "Unauthorized",
    statusCode: 401,
    errorMessage: "Unauthorized. Authentication credentials not valid.",
  },
  Forbidden: {
    key: "Forbidden",
    statusCode: 403,
    errorMessage:
      "Forbidden. You're missing permission to execute this request.",
  },
  NotFound: {
    key: "NotFound",
    statusCode: 404,
    errorMessage: "Not Found. No information to display.",
  },
  NotAllowed: {
    key: "NotAllowed",
    statusCode: 405,
    errorMessage: "Method Not Allowed.",
  },
  WrongOperation: {
    key: "WrongOperation",
    statusCode: 409,
    errorMessage: "This operation cannot be performed.",
  },
  TooManyRequests: {
    key: "TooManyRequests",
    statusCode: 429,
    errorMessage: "Too many requests sent.",
  },
  ServerError: {
    key: "ServerError",
    statusCode: 500,
    errorMessage:
      "Server encountered an unexpected condition that prevented it from fulfilling the request.",
  },
} as const;

export const ErrorsTypesList = Object.keys(
  ErrorsTypes
) as (keyof typeof ErrorsTypes)[];
export const ErrorsCodesList = Object.values(ErrorsTypes).map(
  (el) => el.statusCode
);
export const ErrorsMessagesList = Object.values(ErrorsTypes).map(
  (el) => el.errorMessage
);
