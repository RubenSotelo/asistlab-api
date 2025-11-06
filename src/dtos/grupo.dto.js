const { z } = require("zod");
const { optionalString, optionalNumber } = require("./dto.helper");

const GrupoSchema = {
  nombre: z.string()
    .min(1, "El nombre del grupo es obligatorio")
    .max(10, "El nombre no puede superar 10 caracteres"),

  carrera_id: z.number({
    required_error: "carrera_id es obligatorio",
    invalid_type_error: "carrera_id debe ser un número",
  }).int().positive(),

  semestre_id: z.number({
    required_error: "semestre_id es obligatorio",
    invalid_type_error: "semestre_id debe ser un número",
  }).int().positive(),
};

const GrupoDTO = z.object(GrupoSchema);

const GrupoUpdateDTO = z.object({
  nombre: optionalString(GrupoSchema.nombre),
  carrera_id: optionalNumber(GrupoSchema.carrera_id),
  semestre_id: optionalNumber(GrupoSchema.semestre_id)
});

module.exports = {GrupoDTO, GrupoUpdateDTO};