const express = require("express");
const router = express.Router();
const UsuarioController = require("../controllers/usuario.controller");
const auth = require("../middleware/auth");

router.post("/login", UsuarioController.login);
router.get("/logout/:id", UsuarioController.logout);

// CRUD (protegido)
router.post("/",  UsuarioController.crear);
router.get("/",  UsuarioController.listar);
router.get("/:id",  UsuarioController.seleccionar);
router.put("/:id",  UsuarioController.editar);
router.delete("/:id",  UsuarioController.eliminar);

module.exports = router;
