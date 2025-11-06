const { DataTypes } = require("sequelize");
const { academicaDb } = require("../config/database");

const Materia = academicaDb.define('materia', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    carrera_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    semestre_id: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    requiere_laboratorio: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'materia',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

module.exports = Materia;
