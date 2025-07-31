import app from "./config/server";
import { logger } from "./utils/logger";

app.listen(3000, () => {
  logger.info("Servidor corriendo en puerto 3000");
});