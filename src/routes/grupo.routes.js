const { Router } = require("express");
const grupoController = require("../controllers/grupo.controller");
const auth = require("../middleware/auth");

const router = Router();

router.get("/", grupoController.listar);
router.get("/:id", grupoController.seleccionar);
router.post("/", auth.verifyToken, auth.isAdmin, grupoController.crear);
router.put("/:id", auth.verifyToken, auth.isAdmin, grupoController.editar);
router.delete("/:id", auth.verifyToken, auth.isAdmin, grupoController.eliminar);

module.exports = router;