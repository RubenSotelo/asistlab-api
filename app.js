const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const config = require("./src/config/env");
const errorHandler = require("./src/middleware/errorHandler");
const logger = require("./src/utils/logger");

// Importar rutas
const routes = require("./src/routes/index.routes");


const app = express();

// Middlewares de seguridad
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite por IP
  message: "Demasiadas solicitudes desde esta IP",
});
app.use(limiter);

// Logging
app.use(
  morgan(config.environment === "development" ? "dev" : "combined", {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);

// Middlewares generales
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Archivos estáticos
app.use(express.static(config.app.static));

// Rutas
app.use('/api/v1', routes);


// Manejo de errores (debe ser el último middleware)
app.use(errorHandler);

module.exports = app;
