const { Router } = require("express");
const AlumnoGrupoController = require("../controllers/alumnoGrupo.controller");
const auth = require("../middleware/auth");

const router = Router();

router.get("/", AlumnoGrupoController.listar);
router.get("/:id", AlumnoGrupoController.seleccionar);
router.post("/", AlumnoGrupoController.crear);
router.put("/:id", auth.verifyToken, auth.isAdmin, AlumnoGrupoController.editar);
router.delete("/:id", auth.verifyToken, auth.isAdmin, AlumnoGrupoController.eliminar);

module.exports = router;
