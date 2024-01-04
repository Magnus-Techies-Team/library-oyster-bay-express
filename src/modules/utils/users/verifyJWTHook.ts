import { verify, sign } from "jsonwebtoken";
import { FastifyRequest, FastifyReply } from "fastify";
import { UnauthorizedError } from "../../../server/utils/common/errors/error";

export const verifyJWTHook = async (
  req: FastifyRequest,
  rep: FastifyReply
): Promise<any> => {
  const refresh = req.cookies["ref"];
  const access = req.cookies["acc"];
  if (!refresh) {
    throw new UnauthorizedError("No refresh token", "verifyJWTHook");
  }
  verify(
    refresh,
    <string>process.env.REFRESH_TOKEN_SECRET,
    (error, refreshDecoded: any) => {
      if (error) {
        throw new UnauthorizedError("Token expired", "verifyJWTHook");
      }
      verify(
        access,
        <string>process.env.ACCESS_TOKEN_SECRET,
        (error, decoded) => {
          if (error || !decoded) {
            const newAccess = sign(
              refreshDecoded,
              <string>process.env.ACCESS_TOKEN_SECRET
            );
            rep.setCookie("acc", newAccess);
          }
          rep.setCookie("uuid", refreshDecoded.id);
        }
      );
    }
  );
};
