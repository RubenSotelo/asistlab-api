// src/models/index.js
const { authDb, academicaDb, alumnosDb, laboratoriosDb, asistenciasDb } = require('../config/database');

// ============================
// 🔹 auth_db
// ============================
const Usuario = require('./usuario');
const Tipo = require('./tipo');
Usuario.belongsTo(Tipo, { foreignKey: 'tipo_id', as: 'tipo' });

// ============================
// 🔹 academica_db
// ============================
const Carrera = require('./carrera');
const Semestre = require('./semestre');
const Grupo = require('./grupo');
const Materia = require('./materia');
Grupo.belongsTo(Carrera, { foreignKey: 'carrera_id', as: 'carrera' });
Grupo.belongsTo(Semestre, { foreignKey: 'semestre_id', as: 'semestre' });
Materia.belongsTo(Carrera, { foreignKey: 'carrera_id', as: 'carrera' });
Materia.belongsTo(Semestre, { foreignKey: 'semestre_id', as: 'semestre' });

// ============================
// 🔹 alumnos_db
// ============================
const Alumno = require('./alumno');
const AlumnoGrupo = require('./alumnoGrupo');
AlumnoGrupo.belongsTo(Alumno, { foreignKey: 'alumno_id', as: 'alumno' });
Alumno.hasMany(AlumnoGrupo, { foreignKey: 'alumno_id', as: 'alumno_grupos' });
// ============================
// 🔹 laboratorios_db
// ============================
const Laboratorio = require('./laboratorio');
const Sesion = require('./sesion');
Sesion.belongsTo(Laboratorio, { foreignKey: 'laboratorio_id', as: 'laboratorio' });
Laboratorio.hasMany(Sesion, { foreignKey: 'laboratorio_id', as: 'sesiones' });

// ============================
// 🔹 asistencias_db
// ============================
const RegistroAsistencia = require('./registroAsistencia');

// ============================
// 🔹 Exportación central
// ============================
module.exports = {
  authDb, academicaDb, alumnosDb, laboratoriosDb, asistenciasDb,
  Usuario,
  Tipo,
  Carrera,
  Semestre,
  Grupo,
  Materia,
  Alumno,
  AlumnoGrupo,
  Laboratorio,
  Sesion,
  RegistroAsistencia
};