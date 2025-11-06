const { z } = require("zod");
const { optionalString, optionalNumber, optionalBoolean } = require("./dto.helper");

const RegistroAsistenciaSchema = {
  sesion_id: z.number({
    required_error: "sesion_id es obligatorio",
    invalid_type_error: "Debe ser un número"
  }).int().positive(),

  alumno_id: z.number({
    required_error: "alumno_id es obligatorio",
    invalid_type_error: "Debe ser un número"
  }).int().positive(),

  laboratorio_id: z.number({
    required_error: "laboratorio_id es obligatorio",
    invalid_type_error: "Debe ser un número"
  }).int().positive(),

  presente: z.boolean().default(true),
  hora_registro: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, "Formato de hora inválido (HH:mm)").optional(),
  metodo_registro: z.enum(["qr", "manual"]).default("manual"),
};

// DTO para CREAR
const RegistroAsistenciaDTO = z.object({
  sesion_id: RegistroAsistenciaSchema.sesion_id,
  alumno_id: RegistroAsistenciaSchema.alumno_id,
  laboratorio_id: RegistroAsistenciaSchema.laboratorio_id,
  presente: RegistroAsistenciaSchema.presente.optional(),
  hora_registro: RegistroAsistenciaSchema.hora_registro,
  metodo_registro: RegistroAsistenciaSchema.metodo_registro.optional()
});

// DTO para ACTUALIZAR
const RegistroAsistenciaUpdateDTO = z.object({
  sesion_id: optionalNumber(RegistroAsistenciaSchema.sesion_id),
  alumno_id: optionalNumber(RegistroAsistenciaSchema.alumno_id),
  laboratorio_id: optionalNumber(RegistroAsistenciaSchema.laboratorio_id),
  presente: optionalBoolean(RegistroAsistenciaSchema.presente),
  hora_registro: optionalString(RegistroAsistenciaSchema.hora_registro),
  metodo_registro: optionalString(RegistroAsistenciaSchema.metodo_registro)
});

module.exports = {RegistroAsistenciaDTO, RegistroAsistenciaUpdateDTO};