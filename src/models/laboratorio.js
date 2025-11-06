const { DataTypes } = require("sequelize");
const { laboratoriosDb } = require("../config/database");

const Laboratorio = laboratoriosDb.define('laboratorio', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    capacidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 30
    },
    estado: {
      type: DataTypes.STRING(150),
      defaultValue: 'disponible'
    },
    qr_code: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    sesion_activa_id: {
        type: DataTypes.INTEGER
    }
  }, {
    tableName: 'laboratorio',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

module.exports = Laboratorio;