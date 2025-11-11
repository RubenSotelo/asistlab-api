const dotenv = require("dotenv");

// ✅ --- INICIO DE LA CORRECCIÓN ---
// Solo carga el archivo .env si NO estamos en producción.
// Render setea NODE_ENV="production" automáticamente
// (como se ve en tu variable de entorno).
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}
// ✅ --- FIN DE LA CORRECCIÓN ---


/**
 * Función helper para construir la URL de conexión de la BD 
 * si no se provee una URL completa (para desarrollo local).
 */
function getConnectionUrl(config) {
  // Si la URL ya está (ej. en Render), la usamos.
  if (config.url) {
    return config.url;
  }
  // Si no, la construimos desde el .env local.
  return `postgresql://${config.username}:${config.password}@${config.host}:${config.port}/${config.database}`;
}

// Configuración de la BD de Autenticación
const authConfig = {
  url: process.env.AUTH_DB_URL, // Para Render
  host: process.env.AUTH_DBHOST || '127.0.0.1', // Fallback para local
  port: process.env.AUTH_DBPORT || 5432,
  username: process.env.AUTH_DBUSER,
  password: process.env.AUTH_DBPASSWORD,
  database: process.env.AUTH_DATABASE,
  dialect: "postgres",
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
};
authConfig.url = getConnectionUrl(authConfig); // Construye la URL si falta

// Configuración de la BD Académica
const academicaConfig = {
  url: process.env.ACADEMICA_DB_URL,
  host: process.env.ACADEMICA_DBHOST || '127.0.0.1',
  port: process.env.ACADEMICA_DBPORT || 5432,
  username: process.env.ACADEMICA_DBUSER,
  password: process.env.ACADEMICA_DBPASSWORD,
  database: process.env.ACADEMICA_DATABASE,
  dialect: "postgres",
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
};
academicaConfig.url = getConnectionUrl(academicaConfig);

// Configuración de la BD de Alumnos
const alumnosConfig = {
  url: process.env.ALUMNOS_DB_URL,
  host: process.env.ALUMNOS_DBHOST || '127.0.0.1',
  port: process.env.ALUMNOS_DBPORT || 5432,
  username: process.env.ALUMNOS_DBUSER,
  password: process.env.ALUMNOS_DBPASSWORD,
  database: process.env.ALUMNOS_DATABASE,
  dialect: "postgres",
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
};
alumnosConfig.url = getConnectionUrl(alumnosConfig);

// Configuración de la BD de Laboratorios
const laboratoriosConfig = {
  url: process.env.LABORATORIOS_DB_URL,
  host: process.env.LABORATORIOS_DBHOST || '127.0.0.1',
  port: process.env.LABORATORIOS_DBPORT || 5432,
  username: process.env.LABORATORIOS_DBUSER,
  password: process.env.LABORATORIOS_DBPASSWORD,
  database: process.env.LABORATORIOS_DATABASE,
  dialect: "postgres",
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
};
laboratoriosConfig.url = getConnectionUrl(laboratoriosConfig);

// Configuración de la BD de Asistencias
const asistenciasConfig = {
  url: process.env.ASISTENCIAS_DB_URL,
  host: process.env.ASISTENCIAS_DBHOST || '127.0.0.1',
  port: process.env.ASISTENCIAS_DBPORT || 5432,
  username: process.env.ASISTENCIAS_DBUSER,
  password: process.env.ASISTENCIAS_DBPASSWORD,
  database: process.env.ASISTENCIAS_DATABASE,
  dialect: "postgres",
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
};
asistenciasConfig.url = getConnectionUrl(asistenciasConfig);


module.exports = {
  environment: process.env.NODE_ENV || 'development',
  app: {
    host: process.env.HOST || '0.0.0.0', // Render necesita 0.0.0.0
    port: process.env.PORT || 3000,
    static: process.env.STATIC || './static',
    secret_key: process.env.SECRET_KEY_TOKEN,
  },
  database: {
    auth: authConfig,
    academica: academicaConfig,
    alumnos: alumnosConfig,
    laboratorios: laboratoriosConfig,
    asistencias: asistenciasConfig,
  }
};