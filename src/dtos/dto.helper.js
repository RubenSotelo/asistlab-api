const { z } = require("zod");

/**
 * Pre-procesa campos de string opcionales.
 * Convierte '' y null a undefined.
 */
const optionalString = (schema) => z.preprocess(
  (val) => (val === "" || val === null) ? undefined : val,
  schema.optional()
);

/**
 * Pre-procesa campos numéricos opcionales (que pueden venir de un form como string o null).
 * Convierte '' y null a undefined.
 * Convierte strings numéricos (ej. "25") a números (ej. 25).
 */
const optionalNumber = (schema) => z.preprocess(
  (val) => {
    if (val === "" || val === null) return undefined;
    if (typeof val === 'string') {
      const num = parseFloat(val); // Usamos parseFloat para manejar decimales si fuera necesario
      return isNaN(num) ? val : num; // Si no es número, pasa el string para que z.number() falle
    }
    return val; // Ya es un número
  },
  schema.optional()
);

/**
 * Pre-procesa campos booleanos opcionales.
 * Convierte null a undefined.
 */
const optionalBoolean = (schema) => z.preprocess(
    (val) => (val === null) ? undefined : val,
    schema.optional()
);

module.exports = { 
  optionalString, 
  optionalNumber,
  optionalBoolean
};