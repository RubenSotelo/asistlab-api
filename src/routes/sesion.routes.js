// src/routes/sesion.routes.js
const { Router } = require("express");
const sesionController = require("../controllers/sesion.controller");
const auth = require("../middleware/auth");

const router = Router();

// ✅ --- INICIO DE NUEVA RUTA ---
/**
 * @route GET /api/v1/sesiones/:id/asistencia-detalle
 * Obtiene la lista completa (presentes y ausentes) de una sesión
 * para la vista del profesor.
 */
router.get(
  "/:id/asistencia-detalle",
  auth.verifyToken,
  sesionController.getAsistenciaDetalle
);
// ✅ --- FIN DE NUEVA RUTA ---


router.get("/", sesionController.listar);
router.get("/:id", sesionController.seleccionar);
router.post("/", auth.verifyToken, auth.isAdmin, sesionController.crear);
router.put("/:id", auth.verifyToken, auth.isAdmin, sesionController.editar);
router.delete("/:id", auth.verifyToken, auth.isAdmin, sesionController.eliminar);

module.exports = router;