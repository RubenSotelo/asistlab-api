const { z } = require("zod");
const { optionalString, optionalNumber, optionalBoolean } = require("./dto.helper");

const LaboratorioSchema = {
  nombre: z.string()
    .min(1, "El nombre del laboratorio es obligatorio")
    .max(100, "El nombre no puede superar 100 caracteres"),

  capacidad: z.number()
    .int("La capacidad debe ser un número entero")
    .positive("La capacidad debe ser mayor a 0")
    .default(30),

  estado: z.enum(["disponible", "mantenimiento", "fuera_servicio"]).default("disponible"),
  activo: z.boolean().default(true),
};

// DTO para CREAR (hacemos opcionales los campos con default)
const LaboratorioDTO = z.object({
  nombre: LaboratorioSchema.nombre,
  capacidad: LaboratorioSchema.capacidad.optional(),
  estado: LaboratorioSchema.estado.optional(),
  activo: LaboratorioSchema.activo.optional(),
});

// DTO para ACTUALIZAR
const LaboratorioUpdateDTO = z.object({
  nombre: optionalString(LaboratorioSchema.nombre),
  capacidad: optionalNumber(LaboratorioSchema.capacidad),
  estado: optionalString(LaboratorioSchema.estado),
  activo: optionalBoolean(LaboratorioSchema.activo)
});

module.exports = {LaboratorioDTO, LaboratorioUpdateDTO};