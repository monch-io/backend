import { parseEnv } from "znv";
import { z } from "zod";

/**
 * Configuration for the application
 */
export const Config = z.object({
  /**
   * What port to run the API on
   */
  PORT: z.number().positive().int(),
  /**
   * The MongoDB connection string
   */
  MONGO_DB_URI: z.string(),
});
export interface Config extends z.infer<typeof Config> {}

/**
 * The global configuration
 */
export const CONFIG = parseEnv(process.env, Config.shape);
