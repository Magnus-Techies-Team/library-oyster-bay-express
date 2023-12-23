import { PgErrorCodes } from "../../../../db/types/pgErrorCodes";

import { ErrorsTypes } from "./errorTypes";

type PgError = {
  message: string;
  code: number;
};

export const getPgError = (errorCode: string): PgError => {
  const errorResponse = PgErrorCodes[errorCode];
  if (!errorResponse) {
    return {
      message: "Error while executing query.",
      code: ErrorsTypes.ServerError.statusCode,
    };
  } else {
    return errorResponse;
  }
};
