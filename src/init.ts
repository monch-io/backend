import * as dotenv from "dotenv";
// import { setupDaosWithMongoose } from "./data/mongoose/init";
dotenv.config();

import { startService } from "./service/init";

const main = async () => {
  // const daos = await setupDaosWithMongoose();
  await startService();
};

main().catch((err) => {
  throw err;
});
