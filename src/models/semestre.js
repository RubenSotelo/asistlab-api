const { DataTypes } = require("sequelize");
const { academicaDb } = require("../config/database");

const Semestre = academicaDb.define('semestre', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    numero: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'semestre',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);

module.exports = Semestre;