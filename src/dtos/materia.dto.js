const { z } = require("zod");
const { optionalString, optionalNumber, optionalBoolean } = require("./dto.helper");

const MateriaSchema = {
  nombre: z.string()
    .min(1, "El nombre de la materia es obligatorio")
    .max(150, "El nombre no puede superar 150 caracteres"),

  carrera_id: z.number({
    required_error: "carrera_id es obligatorio",
    invalid_type_error: "carrera_id debe ser un número",
  }).int().positive(),

  semestre_id: z.number({
    required_error: "semestre_id es obligatorio",
    invalid_type_error: "semestre_id debe ser un número",
  }).int().positive(),

  requiere_laboratorio: z.boolean().default(true),
};

// DTO para CREAR
const MateriaDTO = z.object({
  nombre: MateriaSchema.nombre,
  carrera_id: MateriaSchema.carrera_id,
  semestre_id: MateriaSchema.semestre_id,
  requiere_laboratorio: MateriaSchema.requiere_laboratorio.optional()
});

// DTO para ACTUALIZAR
const MateriaUpdateDTO = z.object({
  nombre: optionalString(MateriaSchema.nombre),
  carrera_id: optionalNumber(MateriaSchema.carrera_id),
  semestre_id: optionalNumber(MateriaSchema.semestre_id),
  requiere_laboratorio: optionalBoolean(MateriaSchema.requiere_laboratorio)
});

module.exports = {MateriaDTO, MateriaUpdateDTO};