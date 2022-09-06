import { parseEnv } from "znv";
import { z } from "zod";

// Configuration for the application
export const Config = z.object({
  // What port to run the API on
  PORT: z.number().positive().int(),
});
export interface Config extends z.infer<typeof Config> {}

export const CONFIG = parseEnv(process.env, Config.shape);
