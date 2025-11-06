const { z } = require("zod");
const { optionalString, optionalNumber } = require("./dto.helper");

const AlumnoSchema = {
  usuario_id: z.number({
    required_error: "El usuario_id es obligatorio",
    invalid_type_error: "usuario_id debe ser un número",
  }).int().positive(),

  matricula: z.string()
    .min(3, "La matrícula debe tener al menos 3 caracteres")
    .max(20, "La matrícula no puede superar 20 caracteres"),
};

const AlumnoDTO = z.object(AlumnoSchema);

const AlumnoUpdateDTO = z.object({
  usuario_id: optionalNumber(AlumnoSchema.usuario_id),
  matricula: optionalString(AlumnoSchema.matricula)
});

module.exports = { AlumnoDTO, AlumnoUpdateDTO };