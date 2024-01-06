import { verify, sign } from "jsonwebtoken";
import { FastifyRequest, FastifyReply } from "fastify";
import { UnauthorizedError } from "../../../server/utils/common/errors/error";
import _CONFIG from "../../../config";

export const verifyJWTHook = async (
  req: FastifyRequest,
  rep: FastifyReply
): Promise<any> => {
  const refresh = req.cookies["ref"];
  const access = req.cookies["acc"];
  if (!refresh) {
    throw new UnauthorizedError("No refresh token", "verifyJWTHook");
  }
  console.log(refresh);
  console.log(access);
  verify(
    refresh,
    <string>_CONFIG.app.security.REFRESH_TOKEN_SECRET,
    (error, refreshDecoded: any) => {
      if (error) {
        throw new UnauthorizedError("Token expired", "verifyJWTHook");
      }
      verify(
        access,
        <string>_CONFIG.app.security.ACCESS_TOKEN_SECRET,
        (error, decoded) => {
          if (error || !decoded) {
            const newAccess = sign(
              refreshDecoded,
              <string>_CONFIG.app.security.ACCESS_TOKEN_SECRET
            );
            rep.setCookie("acc", newAccess);
          }
          rep.setCookie("id", refreshDecoded.id);
        }
      );
    }
  );
};
