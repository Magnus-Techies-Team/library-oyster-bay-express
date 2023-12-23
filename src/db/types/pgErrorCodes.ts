import { ErrorsTypes } from "../../server/utils/common/errors/errorTypes";

interface IPgErrorCodes {
  [code: string]: {
    message: string;
    code: number;
  };
}

export const PgErrorCodes: IPgErrorCodes = {
  "23502": {
    message: "Null value in column violates not-null constraint.",
    code: ErrorsTypes.BadRequest.statusCode,
  },
  "23503": {
    message: "Foreign key violation. Record not found.",
    code: ErrorsTypes.NotFound.statusCode,
  },
  "23505": {
    message: "Duplicate key value violates unique constraint.",
    code: ErrorsTypes.WrongOperation.statusCode,
  },
  "42703": {
    message: "Column does not exist.",
    code: ErrorsTypes.BadRequest.statusCode,
  },
  "42P01": {
    message: "Relation does not exist.",
    code: ErrorsTypes.BadRequest.statusCode,
  },
  "53000": {
    message: "Insufficient resources to complete the operation.",
    code: ErrorsTypes.ServerError.statusCode,
  },
  "53300": {
    message: "Too many connections.",
    code: ErrorsTypes.ServerError.statusCode,
  },
  "22P02": {
    message: "Invalid text representation.",
    code: ErrorsTypes.BadRequest.statusCode,
  },
};
