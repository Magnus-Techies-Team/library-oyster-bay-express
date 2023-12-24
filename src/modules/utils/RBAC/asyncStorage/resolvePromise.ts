import { Callback, AuthorizationHookResponse } from "./types";

export const resolvePromise = (
  callback: Callback
): Promise<AuthorizationHookResponse> => {
  return new Promise((resolve, _rejects) => resolve(callback()));
};
