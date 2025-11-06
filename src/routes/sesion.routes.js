const { Router } = require("express");
const sesionController = require("../controllers/sesion.controller");
const auth = require("../middleware/auth");

const router = Router();

router.get("/", sesionController.listar);
router.get("/:id", sesionController.seleccionar);
router.post("/", auth.verifyToken, auth.isAdmin, sesionController.crear);
router.put("/:id", auth.verifyToken, auth.isAdmin, sesionController.editar);
router.delete("/:id", auth.verifyToken, auth.isAdmin, sesionController.eliminar);

module.exports = router;
