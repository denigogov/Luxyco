import type {
  PersistedClient,
  Persister,
} from "@tanstack/react-query-persist-client";
import { del, get, set } from "idb-keyval";

const PERSIST_KEY = "rq-cache-v1";

export const idbPersister: Persister = {
  persistClient: async (client: PersistedClient) => {
    await set(PERSIST_KEY, client);
  },
  restoreClient: async () => {
    return await get<PersistedClient>(PERSIST_KEY);
  },
  removeClient: async () => {
    await del(PERSIST_KEY);
  },
};
