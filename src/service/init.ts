import express from "express";
import * as trpcExpress from "@trpc/server/adapters/express";
import { GlobalContext } from "./context";
import { appRouter } from "./router";
import { CONFIG } from "../utils/config";
import { LOG } from "../utils/log";

const app = express();

// Start the API server
export const startService = async (
  globalContext: GlobalContext
): Promise<void> => {
  app.use(
    "/api",
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
