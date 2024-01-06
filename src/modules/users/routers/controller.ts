import { FastifyReply, FastifyRequest } from "fastify";
import { sign } from "jsonwebtoken";
import { Controller, GET, Inject, POST } from "fastify-decorators";
import UserManager, { userManagerToken } from "../../utils/users/userManager";
import {
  RouteGenericInterfaceCreateUser,
  RouteGenericInterfaceLogin,
} from "../types/reqInterface";
import { hashPassword } from "../../utils/users/hashPassword";
import { verifyJWTHook } from "../../utils/users/verifyJWTHook";
import _CONFIG from "../../../config";
import { UnauthorizedError } from "../../../server/utils/common/errors/error";

@Controller("/users")
export class UserController {
  @Inject(userManagerToken)
  private _userManagerService!: UserManager;

  @POST("/sign-up", { preHandler: hashPassword })
  public async createUser(
    req: FastifyRequest<RouteGenericInterfaceCreateUser>,
    rep: FastifyReply
  ): Promise<FastifyReply> {
    const user = await this._userManagerService.createUser(req.body);
    return rep.status(200).send(user);
  }

  @POST("/sign-in", { preHandler: hashPassword })
  public async login(
    req: FastifyRequest<RouteGenericInterfaceLogin>,
    rep: FastifyReply
  ): Promise<FastifyReply> {
    const user = await this._userManagerService.login(req.body);
    const jwt = sign(user, <string>_CONFIG.app.security.REFRESH_TOKEN_SECRET, {
      expiresIn: 21600,
    });
    const acc = sign(user, <string>_CONFIG.app.security.ACCESS_TOKEN_SECRET, {
      expiresIn: 300,
    });
    const expDate = new Date("Fri, 31 Dec 9999 23:59:59 GMT");
    return rep
      .setCookie("ref", jwt, {
        path: "/",
        domain: "localhost",
        httpOnly: true,
        sameSite: "strict",
        expires: expDate,
      })
      .setCookie("acc", acc, {
        path: "/",
        domain: "localhost",
        httpOnly: true,
        sameSite: "strict",
        expires: expDate,
      })
      .setCookie("id", user.id, {
        path: "/",
        domain: "localhost",
        httpOnly: true,
        sameSite: "strict",
        expires: expDate,
      })
      .status(200)
      .send({ jwt: acc, user });
  }

  @POST("/sign-out")
  public async logout(
    req: FastifyRequest,
    rep: FastifyReply
  ): Promise<FastifyReply> {
    rep.clearCookie("ref");
    rep.clearCookie("acc");
    rep.clearCookie("id");
    return rep.status(200).send({ message: "Logout" });
  }

  @GET("/", { preHandler: verifyJWTHook })
  public async getUser(
    req: FastifyRequest,
    rep: FastifyReply
  ): Promise<FastifyReply> {
    const uuid = Number(req.cookies.id);
    if (!uuid || isNaN(uuid)) {
      throw new UnauthorizedError("User is not authorized", "UserController");
    }
    const userData = await this._userManagerService.getUser(uuid);
    return rep.status(200).send(userData);
  }
}
