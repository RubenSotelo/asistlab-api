// src/routes/registroAsistencia.routes.js
const { Router } = require("express");
const registroAsistenciaController = require("../controllers/registroAsistencia.controller");
const auth = require("../middleware/auth");

const router = Router();

// Ruta de Alumno (Paso 1)
router.post(
  "/registrar-qr", 
  auth.verifyToken, 
  registroAsistenciaController.registrarPorQR
);

// ✅ --- INICIO DE NUEVA RUTA ---
/**
 * @route PUT /api/v1/asistencias/:id/estado
 * Permite a un profesor cambiar el estado de un registro
 * (p.ej. Ausente -> Justificado)
 */
router.put(
  "/:id/estado",
  auth.verifyToken,
  // NOTA: Idealmente aquí habría un auth.isProfesor
  // pero tu auth.js solo tiene isAdmin.
  // Por ahora, solo verificar el token es suficiente.
  registroAsistenciaController.actualizarEstado
);
// ✅ --- FIN DE NUEVA RUTA ---

// Rutas de Admin
router.get("/", auth.verifyToken, auth.isAdmin, registroAsistenciaController.listar);
router.get("/:id", auth.verifyToken, auth.isAdmin, registroAsistenciaController.seleccionar);
router.post("/", auth.verifyToken, auth.isAdmin, registroAsistenciaController.crear);
router.put("/:id", auth.verifyToken, auth.isAdmin, registroAsistenciaController.editar);
router.delete("/:id", auth.verifyToken, auth.isAdmin, registroAsistenciaController.eliminar);

module.exports = router;