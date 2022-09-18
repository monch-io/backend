import * as trpc from "@trpc/server";
import superjson from "superjson";
import { Exception } from "../utils/exceptions";
import { LOG } from "../utils/log";
import { Context } from "./context";
import { ingredientsRouter } from "./routes/ingredients";
import { inventoryRouter } from "./routes/inventory";
import { mealsRouter } from "./routes/meals";
import { recipesRouter } from "./routes/recipes";

const baseRouter = trpc.router<Context>();

export const appRouter = baseRouter
  .transformer(superjson)
  .middleware(({ type, path, next }) => {
    LOG.info(`[${type.toUpperCase()}] ${path}`);
    return next();
  })
  .formatError((formatter) => {
    // If the error was an `Exception`, turn it into a TRPC error:
    if (formatter.error.cause instanceof Exception) {
      const error = formatter.error.cause.toTRPCError();
      LOG.error(error);
      return trpc.router().getErrorShape({
        ctx: formatter.ctx,
        error,
        input: formatter.input,
        path: formatter.path,
        type: formatter.type,
      });
    }

    LOG.error(formatter.error);
    return trpc.router().getErrorShape(formatter);
  })
  .merge("recipes.", recipesRouter)
  .merge("ingredients.", ingredientsRouter)
  .merge("meals.", mealsRouter)
  .merge("inventory.", inventoryRouter);

export type AppRouter = typeof appRouter;
