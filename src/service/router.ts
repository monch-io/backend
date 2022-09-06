import * as trpc from "@trpc/server";
import { Context } from "./context";
import { ingredientsRouter } from "./routes/ingredients";
import { recipesRouter } from "./routes/recipes";

export const appRouter = trpc
  .router<Context>()
  .merge("recipes.", recipesRouter)
  .merge("ingredients.", ingredientsRouter);

export type AppRouter = typeof appRouter;
