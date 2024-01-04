import { AccessLevel } from "../../../../db/types/customTypes";

export function authorizeBasedOnIdentity(
  userAccessLevel: AccessLevel,
  resourceAccessLevel: AccessLevel
) {
  return userAccessLevel >= resourceAccessLevel;
}
