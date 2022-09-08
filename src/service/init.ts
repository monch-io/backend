import express from "express";
import * as trpcExpress from "@trpc/server/adapters/express";
import { GlobalContext } from "./context";
import { appRouter } from "./router";
import { CONFIG } from "../utils/config";
import { LOG } from "../utils/log";
import * as trpcPlayground from "trpc-playground/handlers/express";

const API_ENDPOINT = "/api";
const API_PLAYGROUND_ENDPOINT = "/api-playground";

// Start the API server
export const startService = async (
  globalContext: GlobalContext
): Promise<void> => {
  const app = express();

  app.use(
    API_ENDPOINT,
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext: () => ({ ...globalContext }),
      onError: ({ error }) => {
        LOG.error(error);
      },
    })
  );

  app.use(
    API_PLAYGROUND_ENDPOINT,
    await trpcPlayground.expressHandler({
      trpcApiEndpoint: API_ENDPOINT,
      playgroundEndpoint: API_PLAYGROUND_ENDPOINT,
      router: appRouter,
    })
  );

  return new Promise((resolve) =>
    app.listen(CONFIG.PORT, () => {
      LOG.info(`API server started on port ${CONFIG.PORT}`);
      resolve(undefined);
    })
  );
};
