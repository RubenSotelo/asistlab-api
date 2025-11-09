// src/routes/reporte.routes.js
const { Router } = require("express");
const reporteController = require("../controllers/reporte.controller");
const auth = require("../middleware/auth");

const router = Router();

// Proteger todas las rutas de este archivo con autenticación de Admin
router.use(auth.verifyToken, auth.isAdmin);

/**
 * @route POST /api/v1/reportes/asistencia-general
 * Genera un reporte de asistencia general
 */
router.post(
  "/asistencia-general",
  reporteController.generarReporteAsistencia
);

/* Aquí puedes añadir las rutas para tus otros reportes cuando los implementes

  router.post(
    "/uso-laboratorios",
    reporteController.generarReporteUsoLaboratorios
  );

  router.post(
    "/asistencia-profesor",
    reporteController.generarReporteProfesor
  );
*/

module.exports = router;