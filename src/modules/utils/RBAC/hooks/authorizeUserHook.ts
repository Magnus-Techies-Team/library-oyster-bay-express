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
    console.log(req.routerPath);
    try {
      const organizationId = req.query.organizationId;
      if (!organizationId)
        throw new ForbiddenError(
          "Organization id is not provided",
          "authorizeUserHook"
        );
      const user = {
        id: 1,
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
      done(error);
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
          userExternalId: value.organizationId,
        }
      );
    }
  });
};
