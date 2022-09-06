import * as dotenv from "dotenv";
dotenv.config();

import { startService } from "./service/init";

const main = async () => {
  await startService();
};

main().catch((err) => {
  throw err;
});
