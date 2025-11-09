// src/routes/alumno.routes.js
const { Router } = require("express");
const alumnoController = require("../controllers/alumno.controller");
const auth = require("../middleware/auth");

const router = Router();

// ✅ --- INICIO DE NUEVAS RUTAS (Para Alumnos) ---
// NOTA: Estas rutas deben ir ANTES de '/:id' para que sean procesadas primero.

/**
 * @route GET /api/v1/alumnos/:id/dashboard-data
 * Obtiene los datos consolidados para el dashboard del alumno
 * El :id aquí es el ID del ALUMNO (no del usuario)
 */
router.get(
  "/:id/dashboard-data",
  auth.verifyToken,
  alumnoController.getDashboardData
);

/**
 * @route GET /api/v1/alumnos/:id/historial-data
 * Obtiene las estadísticas y el historial completo de asistencia del alumno
 * El :id aquí es el ID del ALUMNO
 */
router.get(
  "/:id/historial-data",
  auth.verifyToken,
  alumnoController.getHistorialData
);
// ✅ --- FIN DE NUEVAS RUTAS ---


// --- Rutas de Admin (ya existentes) ---
router.get("/", auth.verifyToken, auth.isAdmin, alumnoController.listar);

// Esta ruta genérica ahora va al final
router.get("/:id", auth.verifyToken, alumnoController.seleccionar);

// Ruta de registro (pública, llamada desde el frontend)
router.post("/", alumnoController.crear);

router.put("/:id", auth.verifyToken, auth.isAdmin, alumnoController.editar);
router.delete("/:id", auth.verifyToken, auth.isAdmin, alumnoController.eliminar);

module.exports = router;