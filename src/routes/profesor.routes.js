// src/routes/profesor.routes.js
const { Router } = require("express");
const profesorController = require("../controllers/profesor.controller");
const auth = require("../middleware/auth");

const router = Router();

// Proteger todas las rutas de profesor
router.use(auth.verifyToken);

/**
 * @route GET /api/v1/profesores/:id/grupos
 * Obtiene los grupos únicos asignados a un profesor (para el dropdown)
 */
router.get("/:id/grupos", profesorController.getGruposPorProfesor);

/**
 * @route GET /api/v1/profesores/:id/sesiones-grupo/:grupoId
 * Obtiene las sesiones de un grupo específico (para el segundo dropdown)
 */
router.get("/:id/sesiones-grupo/:grupoId", profesorController.getSesionesPorGrupo);

// ✅ --- INICIO DE NUEVA RUTA ---
/**
 * @route GET /api/v1/profesores/:id/dashboard-data
 * Obtiene los datos consolidados para el dashboard del profesor
 */
router.get("/:id/dashboard-data", profesorController.getDashboardData);
// ✅ --- FIN DE NUEVA RUTA ---

module.exports = router;