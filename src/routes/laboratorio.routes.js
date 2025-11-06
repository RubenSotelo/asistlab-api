const { Router } = require("express");
const laboratorioController = require("../controllers/laboratorio.controller");
const auth = require("../middleware/auth");

const router = Router();

router.get("/", laboratorioController.listar);
router.get("/:id", laboratorioController.seleccionar);
router.post("/", auth.verifyToken, auth.isAdmin, laboratorioController.crear);
router.put("/:id", auth.verifyToken, auth.isAdmin, laboratorioController.editar);
router.delete("/:id", auth.verifyToken, auth.isAdmin, laboratorioController.eliminar);

module.exports = router;
