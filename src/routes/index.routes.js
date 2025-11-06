const { Router } = require("express");

// Importar rutas de cada módulo
const usuarioRoutes = require("./usuario.routes");
const alumnoRoutes = require("./alumno.routes");
const alumnoGrupoRoutes = require("./alumnoGrupo.routes");
const carreraRoutes = require("./carrera.routes");
const semestreRoutes = require("./semestre.routes");
const laboratorioRoutes = require("./laboratorio.routes");
const grupoRoutes = require("./grupo.routes");
const materiaRoutes = require("./materia.routes");
const sesionRoutes = require("./sesion.routes");
const registroAsistenciaRoutes = require("./registroAsistencia.routes");
const tipoRoutes = require("./tipo.routes");

const router = Router();

// Registrar rutas
router.use("/usuarios", usuarioRoutes);
router.use("/alumnos", alumnoRoutes);
router.use("/alumno-grupos", alumnoGrupoRoutes);
router.use("/carreras", carreraRoutes);
router.use("/semestres", semestreRoutes);
router.use("/laboratorios", laboratorioRoutes);
router.use("/grupos", grupoRoutes);
router.use("/materias", materiaRoutes);
router.use("/tipos", tipoRoutes);
router.use("/sesiones", sesionRoutes);
router.use("/asistencias", registroAsistenciaRoutes);

module.exports = router;
