const app = require("./app");
const { authDb, academicaDb, alumnosDb, laboratoriosDb, asistenciasDb } = require("./src/config/database");
const config = require("./src/config/env");
const logger = require("./src/utils/logger");

async function startServer() {
  try {
    // Conectar a todas las bases de datos
    await authDb.authenticate();
    await academicaDb.authenticate();
    await alumnosDb.authenticate();
    await laboratoriosDb.authenticate();
    await asistenciasDb.authenticate();
    logger.info("Conexión a todas las bases de datos establecida correctamente.");

    // Sincronizar modelos (solo en desarrollo)
    if (config.environment === "development") {
      await authDb.sync({ alter: false });
      await academicaDb.sync({ alter: false });
      await alumnosDb.sync({ alter: false });
      await laboratoriosDb.sync({ alter: false });
      await asistenciasDb.sync({ alter: false });
      logger.info("Modelos sincronizados con las bases de datos.");
    }

    // Iniciar servidor
    app.listen(config.app.port, config.app.host, () => {
      logger.info(`Servidor ejecutándose en http://${config.app.host}:${config.app.port}`);
      logger.info(`Entorno: ${config.environment}`);
      logger.info(`Directorio de archivos estáticos: ${config.app.static}`);
    });
  } catch (error) {
    logger.error("Error al iniciar el servidor:", error);
    process.exit(1);
  }
}

// Manejo de cierre graceful
process.on("SIGINT", async () => {
  logger.info("Apagando servidor...");
  await Promise.all([
    authDb.close(),
    academicaDb.close(),
    alumnosDb.close(),
    laboratoriosDb.close(),
    asistenciasDb.close()
  ]);
  process.exit(0);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception thrown:", error);
  process.exit(1);
});

startServer();
