import express from "express";
import * as trpcExpress from "@trpc/server/adapters/express";
import { createContext } from "./context";
import { appRouter } from "./router";
import { CONFIG } from "../utils/config";
import { LOG } from "../utils/log";

const app = express();

app.use(
  "/api",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// Start the API server
export const startService = async (): Promise<void> => {
  return new Promise((resolve) =>
    app.listen(CONFIG.PORT, () => {
      LOG.info(`API server started on port ${CONFIG.PORT}`);
      resolve(undefined);
    })
  );
};
