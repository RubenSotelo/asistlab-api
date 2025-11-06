const { DataTypes } = require("sequelize");
const { authDb } = require("../config/database");

const Tipo = authDb.define('tipo', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    }
  }, 
  {
    tableName: 'tipo',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);

module.exports = Tipo;