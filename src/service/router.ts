import * as trpc from "@trpc/server";
import { Exception } from "../utils/exceptions";
import { Context } from "./context";
import { ingredientsRouter } from "./routes/ingredients";
import { inventoryRouter } from "./routes/inventory";
import { mealsRouter } from "./routes/meals";
import { recipesRouter } from "./routes/recipes";

const baseRouter = trpc.router<Context>();

const errorFormattedRouter = baseRouter.formatError((formatter) => {
  // If the error was an `Exception`, turn it into a TRPC error:
  if (formatter.error.cause instanceof Exception) {
    return baseRouter.getErrorShape({
      ...formatter,
      error: formatter.error.cause.toTRPCError(),
    });
  }
  return baseRouter.getErrorShape(formatter);
});

export const appRouter = errorFormattedRouter
  .merge("recipes.", recipesRouter)
  .merge("ingredients.", ingredientsRouter)
  .merge("meals.", mealsRouter)
  .merge("inventory.", inventoryRouter);

export type AppRouter = typeof appRouter;
