const { Router } = require("express");
const materiaController = require("../controllers/materia.controller");
const auth = require("../middleware/auth");

const router = Router();

router.get("/", materiaController.listar);
router.get("/:id", materiaController.seleccionar);
router.post("/", auth.verifyToken, auth.isAdmin, materiaController.crear);
router.put("/:id", auth.verifyToken, auth.isAdmin, materiaController.editar);
router.delete("/:id", auth.verifyToken, auth.isAdmin, materiaController.eliminar);

module.exports = router;
