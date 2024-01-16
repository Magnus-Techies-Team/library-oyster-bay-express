import { FastifyReply, FastifyRequest } from "fastify";
import { AsyncResource } from "async_hooks";
import AsyncStorageMap from "../asyncStorage";
import { resolvePromise } from "../asyncStorage/resolvePromise";
import logger from "../../../../server/utils/logger";
import { AuthorizationHookResponse } from "../asyncStorage/types";
import { RouteGenericInterfaceWithOrganizationId } from "./types";
import { ForbiddenError } from "../../../../server/utils/common/errors/error";

export const authorizeUserHook = (
  req: FastifyRequest<RouteGenericInterfaceWithOrganizationId>,
  res: FastifyReply,
  done: any
) => {
  resolvePromise(async (): Promise<AuthorizationHookResponse | undefined> => {
    logger.info(req.routerPath, "Authorization User Hook Router Path");
    try {
      const organizationId = Number(req.query.organizationId) || 1;
      const userId = Number(req.cookies["id"]) || 1;
      if (!userId)
        throw new ForbiddenError(
          "User id is not provided",
          "authorizeUserHook"
        );
      const user = {
        id: userId,
        organizationId: organizationId,
      };
      logger.info(
        {
          userId: user.id,
          organizationId: user.organizationId,
        },
        "Authorization User Hook Info"
      );
      return { userId: user.id, organizationId: user.organizationId };
    } catch (error) {
      done(error as ForbiddenError);
    }
  }).then((value) => {
    if (value) {
      if (!value.organizationId) value.organizationId = 0;
      // instead of null there will be an auth function to get permission based on user x-id
      AsyncStorageMap.initStorage(
        () => {
          const asyncResource = new AsyncResource("async-context");
          asyncResource.runInAsyncScope(done);
        },
        {
          userId: value.userId,
          organizationId: value.organizationId,
        }
      );
    }
  });
};
