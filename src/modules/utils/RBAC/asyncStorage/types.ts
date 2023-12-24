export type asyncMapStorage = Map<string, any>;

export type AuthorizationHookResponse = {
  userId: number;
  organizationId: number;
};

export type Callback = (...params: any) => any;

export type KeyType = keyof AuthorizationHookResponse;
