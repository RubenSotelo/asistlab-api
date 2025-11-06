const { Router } = require("express");
const CarreraController = require("../controllers/carrera.controller");
const auth = require("../middleware/auth");

const router = Router();

// CRUD básico
router.get("/", CarreraController.listar);
router.get("/:id", CarreraController.seleccionar);
router.post("/", auth.verifyToken, auth.isAdmin, CarreraController.crear);
router.put("/:id", auth.verifyToken, auth.isAdmin, CarreraController.editar);
router.delete("/:id", auth.verifyToken, auth.isAdmin, CarreraController.eliminar);

module.exports = router;
