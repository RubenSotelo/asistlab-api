const { Router } = require("express");
const registroAsistenciaController = require("../controllers/registroAsistencia.controller");
const auth = require("../middleware/auth");

const router = Router();

router.get("/", registroAsistenciaController.listar);
router.get("/:id", registroAsistenciaController.seleccionar);
router.post("/", auth.verifyToken, auth.isAdmin, registroAsistenciaController.crear);
router.put("/:id", auth.verifyToken, auth.isAdmin, registroAsistenciaController.editar);
router.delete("/:id", auth.verifyToken, auth.isAdmin, registroAsistenciaController.eliminar);

module.exports = router;
