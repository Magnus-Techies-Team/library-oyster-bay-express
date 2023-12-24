import { AsyncLocalStorage } from "async_hooks";
import { asyncMapStorage, KeyType } from "./types";

class AsyncStorageMap {
  asyncStorage: AsyncLocalStorage<asyncMapStorage> =
    new AsyncLocalStorage<asyncMapStorage>();

  public get(key: KeyType): number;

  public get(key: KeyType) {
    const store = this.asyncStorage.getStore();
    return store?.get(key);
  }

  public set = <T>(key: string, value: T): void => {
    const store = this.asyncStorage.getStore();
    store?.set(key, value);
  };

  public initStorage = (
    callback: () => void,
    defaults?: Record<string, any>
  ): void => {
    const store: asyncMapStorage = defaults
      ? new Map(Object.entries(defaults))
      : new Map();

    this.asyncStorage.run(store, () => {
      callback();
    });
  };
}
export default new AsyncStorageMap();
