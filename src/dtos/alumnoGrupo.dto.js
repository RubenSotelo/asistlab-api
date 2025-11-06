const { z } = require("zod");
const { optionalNumber, optionalBoolean } = require("./dto.helper");

const AlumnoGrupoSchema = {
  alumno_id: z.number().int().positive({
    message: "El ID del alumno es obligatorio y debe ser un número positivo"
  }),
  grupo_id: z.number().int().positive({
    message: "El ID del grupo es obligatorio y debe ser un número positivo"
  }),
  activo: z.boolean().default(true)
};

const AlumnoGrupoDTO = z.object(AlumnoGrupoSchema);

const AlumnoGrupoUpdateDTO = z.object({
  alumno_id: optionalNumber(AlumnoGrupoSchema.alumno_id),
  grupo_id: optionalNumber(AlumnoGrupoSchema.grupo_id),
  activo: optionalBoolean(AlumnoGrupoSchema.activo)
});

module.exports = {AlumnoGrupoDTO, AlumnoGrupoUpdateDTO};