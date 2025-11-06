const { DataTypes } = require("sequelize");
const { alumnosDb } = require("../config/database");

const AlumnoGrupo = alumnosDb.define('alumno_grupo', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    alumno_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    grupo_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'alumno_grupo',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    
  });

module.exports = AlumnoGrupo;