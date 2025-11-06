const { Router } = require("express");
const alumnoController = require("../controllers/alumno.controller");
const auth = require("../middleware/auth");

const router = Router();

router.get("/", alumnoController.listar);
router.get("/:id", alumnoController.seleccionar);
router.post("/",  alumnoController.crear);
router.put("/:id",  auth.verifyToken, auth.isAdmin, alumnoController.editar);
router.delete("/:id",  auth.verifyToken, auth.isAdmin, alumnoController.eliminar);

module.exports = router;
