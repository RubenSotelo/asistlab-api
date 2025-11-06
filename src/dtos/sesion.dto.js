const { z } = require("zod");
const { optionalString, optionalNumber } = require("./dto.helper");

const SesionSchema = {
  laboratorio_id: z.number({
    required_error: "laboratorio_id es obligatorio",
    invalid_type_error: "Debe ser un número"
  }).int().positive(),

  profesor_id: z.number({
    required_error: "profesor_id es obligatorio",
    invalid_type_error: "Debe ser un número"
  }).int().positive(),

  grupo_id: z.number({
    required_error: "grupo_id es obligatorio",
    invalid_type_error: "Debe ser un número"
  }).int().positive(),

  materia_id: z.number({
    required_error: "materia_id es obligatorio",
    invalid_type_error: "Debe ser un número"
  }).int().positive(),

  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido (YYYY-MM-DD)"),
  hora_inicio: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, "Formato de hora inválido (HH:mm)"),
  hora_fin: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, "Formato de hora inválido (HH:mm)").optional(),
  actividad: z.string().min(1, "La actividad es obligatoria"),
  estado: z.enum(["activa", "finalizada", "cancelada", "programada"]).default("programada"),
};

// DTO para CREAR
const SesionDTO = z.object({
  laboratorio_id: SesionSchema.laboratorio_id,
  profesor_id: SesionSchema.profesor_id,
  grupo_id: SesionSchema.grupo_id,
  materia_id: SesionSchema.materia_id,
  fecha: SesionSchema.fecha,
  hora_inicio: SesionSchema.hora_inicio,
  hora_fin: SesionSchema.hora_fin,
  actividad: SesionSchema.actividad,
  estado: SesionSchema.estado.optional(),
});

// DTO para ACTUALIZAR
const SesionUpdateDTO = z.object({
  laboratorio_id: optionalNumber(SesionSchema.laboratorio_id),
  profesor_id: optionalNumber(SesionSchema.profesor_id),
  grupo_id: optionalNumber(SesionSchema.grupo_id),
  materia_id: optionalNumber(SesionSchema.materia_id),
  fecha: optionalString(SesionSchema.fecha),
  hora_inicio: optionalString(SesionSchema.hora_inicio),
  hora_fin: optionalString(SesionSchema.hora_fin),
  actividad: optionalString(SesionSchema.actividad),
  estado: optionalString(SesionSchema.estado),
});

module.exports = {SesionDTO, SesionUpdateDTO};