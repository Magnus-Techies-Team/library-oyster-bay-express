import AsyncStorageMap from "../asyncStorage";
import { ForbiddenError } from "../../../../server/utils/common/errors/error";
import { AccessLevel } from "../../../../db/types/customTypes";
import { getInstanceByToken } from "fastify-decorators";
import AccessManager, { accessManagerToken } from "../accessManagement";
import { authorizeBasedOnIdentity } from "../accessManagement/authorizeBasedOnIdentity";

export function RBACEnforce(accessLevel: AccessLevel) {
  /*
   * Development note:
   * If AsyncStorageMap is not implemented in higher function sequence
   * it will always return undefined to any operation (get(), set()).
   *
   * The logic behind AsyncLocalStorage from async_hook is to provide
   * storage across asynchronous request context, thus it is implemented
   * by default to have undefined value returned if it is not defined
   * because Event Loop is creating it by default.
   */

  return function (_target, _propertyKey, descriptor: PropertyDescriptor) {
    const oldFun = descriptor.value;
    descriptor.value = async function () {
      const userId = AsyncStorageMap.get("userId");
      const organizationId = AsyncStorageMap.get("organizationId");
      console.log("[DEBUG] RBACEnforce: ", userId, organizationId);
      const accessManager =
        getInstanceByToken<AccessManager>(accessManagerToken);
      const userRbacInfo = await accessManager.getAccessLevel(
        userId,
        organizationId
      );
      if (userRbacInfo.rowCount === 0)
        throw new ForbiddenError(
          `${userId} does not have access to organization ${organizationId}`,
          "RBACEnforce"
        );
      if (
        authorizeBasedOnIdentity(userRbacInfo.rows[0].access_level, accessLevel)
      ) {
        // eslint-disable-next-line prefer-rest-params
        return oldFun.apply(this, [...arguments]);
      } else {
        throw new ForbiddenError(
          `Wrong access level on organization  ${organizationId} for${userId}`,
          "RBACEnforce"
        );
      }
    };
  };
}
