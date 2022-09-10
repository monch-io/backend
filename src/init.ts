import "source-map-support/register";
import * as dotenv from "dotenv";
dotenv.config();

import { setupDaosWithMongoose as makeDaosWithMongoose } from "./data/mongoose/init";
import { startService } from "./service/init";
import { makeLogicFromDaos } from "./logic/init";

const main = async () => {
  const daos = await makeDaosWithMongoose();
  const logic = await makeLogicFromDaos(daos);
  await startService({ daos, logic });
};

main().catch((err) => {
  throw err;
});
