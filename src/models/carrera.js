const { DataTypes } = require("sequelize");
const { academicaDb } = require("../config/database");

const Carrera = academicaDb.define('carrera', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(150),
      allowNull: false,
    }
  },
  {
    tableName: "carrera",
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);

module.exports = Carrera;
