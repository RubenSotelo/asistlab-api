const { Sequelize } = require('sequelize');
const config = require('./env');

/**
 * Función helper que genera las opciones de Sequelize.
 * Añade automáticamente SSL si detecta una URL de Neon (producción).
 */
const getSequelizeOptions = (dbConfig) => {
  const options = {
    dialect: 'postgres',
    logging: dbConfig.logging, // Usa el logging definido en env.js
  };

  // Si la URL de conexión es de Neon (producción), añade las opciones SSL.
  if (dbConfig.url && dbConfig.url.includes('neon.tech')) {
    options.dialectOptions = {
      ssl: {
        require: true,
        rejectUnauthorized: false // Necesario para Neon
      }
    };
    options.logging = false; // Nunca loguear en producción
  }
  
  return options;
};

// Base de autenticación
const authDb = new Sequelize(
  config.database.auth.url, // <-- Lee la URL (sea local o de Render)
  getSequelizeOptions(config.database.auth) // <-- Aplica las opciones correctas
);

// Base académica
const academicaDb = new Sequelize(
  config.database.academica.url,
  getSequelizeOptions(config.database.academica)
);

// Base de alumnos
const alumnosDb = new Sequelize(
  config.database.alumnos.url,
  getSequelizeOptions(config.database.alumnos)
);

// Base laboratorios
const laboratoriosDb = new Sequelize(
  config.database.laboratorios.url,
  getSequelizeOptions(config.database.laboratorios)
);

// Base de asistencias
const asistenciasDb = new Sequelize(
  config.database.asistencias.url,
  getSequelizeOptions(config.database.asistencias)
);

module.exports = { authDb, academicaDb, alumnosDb, laboratoriosDb, asistenciasDb };