const { DataTypes } = require("sequelize");
const { asistenciasDb } = require("../config/database");

const RegistroAsistencia = asistenciasDb.define('registro_asistencia', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    sesion_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    alumno_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    laboratorio_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    presente: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    hora_llegada: {
      type: DataTypes.TIME
    },
    hora_salida: {
      type: DataTypes.TIME
    },
    metodo_registro: {
      type: DataTypes.STRING(200),
      defaultValue: 'manual'
    }
  }, {
    tableName: 'registro_asistencia',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    
  });

module.exports = RegistroAsistencia;