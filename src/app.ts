import app from "./config/server";

import { connectToDatabase } from "./config/dbPool";
import { logger } from "./utils/logger";

connectToDatabase();

app.listen(3000, () => {
  logger.info("Servidor corriendo en puerto 3000");
});