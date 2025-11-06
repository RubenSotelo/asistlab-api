const { DataTypes } = require("sequelize");
const { academicaDb } = require("../config/database");

const Grupo = academicaDb.define('grupo', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    carrera_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    semestre_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'grupo',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    
  });

module.exports = Grupo;