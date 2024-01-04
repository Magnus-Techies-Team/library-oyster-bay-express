import { FastifyReply, FastifyRequest } from "fastify";
import { AsyncResource } from "async_hooks";
import AsyncStorageMap from "../asyncStorage";
import { resolvePromise } from "../asyncStorage/resolvePromise";
import logger from "../../../../server/utils/logger";
import { AuthorizationHookResponse } from "../asyncStorage/types";

export const authorizeUserHook = (
  req: FastifyRequest,
  res: FastifyReply,
  done: any
) => {
  resolvePromise(async (): Promise<AuthorizationHookResponse | undefined> => {
    console.log(req.routerPath);
    try {
      const user = {
        id: 1,
        organizationId: 1,
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
