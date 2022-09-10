import express from "express";
import * as trpcExpress from "@trpc/server/adapters/express";
import { GlobalContext } from "./context";
import { appRouter } from "./router";
import { CONFIG } from "../utils/config";
import { LOG } from "../utils/log";
import cors from "cors";
import helmet from "helmet";
import * as trpcPlayground from "trpc-playground/handlers/express";

const API_ENDPOINT = "/api";
const API_PLAYGROUND_ENDPOINT = "/api-playground";

// Start the API server
export const startService = async (
  globalContext: GlobalContext
): Promise<void> => {
  const app = express();

  app.use(
    helmet({
      contentSecurityPolicy: false,
    })
  );
  app.use(cors());

  app.use(
    API_PLAYGROUND_ENDPOINT,
    await trpcPlayground.expressHandler({
      trpcApiEndpoint: API_ENDPOINT,
      playgroundEndpoint: API_PLAYGROUND_ENDPOINT,
      router: appRouter,
    })
  );

  app.use(
    API_ENDPOINT,
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext: () => ({ ...globalContext }),
    })
  );

  return new Promise((resolve) =>
    app.listen(CONFIG.PORT, () => {
      LOG.info(`API server started on port ${CONFIG.PORT}`);
      resolve(undefined);
    })
  );
};
