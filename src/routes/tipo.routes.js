const { Router } = require("express");
const tipoController = require("../controllers/tipo.controller");
const auth = require("../middleware/auth");

const router = Router();

router.get("/", tipoController.listar);
router.get("/:id", tipoController.seleccionar);
router.post("/", auth.verifyToken, auth.isAdmin, tipoController.crear);
router.put("/:id", auth.verifyToken, auth.isAdmin, tipoController.editar);
router.delete("/:id", auth.verifyToken, auth.isAdmin, tipoController.eliminar);

module.exports = router;
