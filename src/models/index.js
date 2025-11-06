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
// AlumnoGrupo.grupo_id → referencia lógica, no belongsTo Sequelize

// ============================
// 🔹 laboratorios_db
// ============================
const Laboratorio = require('./laboratorio');
const Sesion = require('./sesion');
Sesion.belongsTo(Laboratorio, { foreignKey: 'laboratorio_id', as: 'laboratorio' });
Laboratorio.hasMany(Sesion, { foreignKey: 'laboratorio_id', as: 'sesiones' });
// Sesion.profesor_id, Sesion.grupo_id, Sesion.materia_id → referencias lógicas, no belongsTo Sequelize

// ============================
// 🔹 asistencias_db
// ============================
const RegistroAsistencia = require('./registroAsistencia');
// todas las referencias son lógicas: sesion_id, alumno_id, laboratorio_id → NO belongsTo Sequelize

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
