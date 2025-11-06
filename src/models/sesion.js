const { DataTypes } = require("sequelize");
const { laboratoriosDb } = require("../config/database");

const Sesion = laboratoriosDb.define('sesion', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    laboratorio_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    profesor_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    grupo_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    materia_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    hora_inicio: {
      type: DataTypes.TIME,
      allowNull: false
    },
    hora_fin: {
      type: DataTypes.TIME
    },
    actividad: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    estado: {
      type: DataTypes.STRING(200),
      defaultValue: 'programada'
    }
  }, {
    tableName: 'sesion',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

module.exports = Sesion;