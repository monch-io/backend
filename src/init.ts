import * as dotenv from "dotenv";
dotenv.config();

import { setupDaosWithMongoose } from "./data/mongoose/init";
import { GlobalContext } from "./service/context";

import { startService } from "./service/init";

const main = async () => {
  const daos = await setupDaosWithMongoose();
  const globalContext: GlobalContext = { daos };
  await startService(globalContext);
};

main().catch((err) => {
  throw err;
});
