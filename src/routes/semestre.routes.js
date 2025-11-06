const { Router } = require("express");
const semestreController = require("../controllers/semestre.controller");
const auth = require("../middleware/auth");

const router = Router();

router.get("/", semestreController.listar);
router.get("/:id", semestreController.seleccionar);
router.post("/", auth.verifyToken, auth.isAdmin, semestreController.crear);
router.put("/:id", auth.verifyToken, auth.isAdmin, semestreController.editar);
router.delete("/:id", auth.verifyToken, auth.isAdmin, semestreController.eliminar);

module.exports = router;
