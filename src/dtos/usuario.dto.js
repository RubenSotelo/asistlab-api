const { z } = require("zod");
const { optionalString, optionalNumber } = require("./dto.helper");

// Esquema base para reutilizar
const UsuarioSchema = {
  tipo_id: z.number({
    required_error: "El tipo de usuario es obligatorio",
    invalid_type_error: "El tipo de usuario debe ser un número"
  })
  .int("El tipo de usuario debe ser un número entero")
  .positive("El tipo de usuario debe ser un número positivo"),

  nombre: z.string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(150, "El nombre no puede superar 150 caracteres")
    .regex(/^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]+$/, "El nombre solo puede contener letras y espacios"),

  email: z.string()
    .min(1, "El email es requerido")
    .max(150, "El email no puede superar 150 caracteres")
    .email("Formato de correo inválido"),

  password: z.string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(100, "La contraseña no puede superar 100 caracteres")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/,
      "La contraseña debe tener al menos una mayúscula, una minúscula, un número y un símbolo especial (@$!%*?&.)"
    ),
};

// DTO para CREAR (Campos requeridos)
const UsuarioDTO = z.object(UsuarioSchema);

// DTO para ACTUALIZAR (Campos opcionales que ignoran '')
const UsuarioUpdateDTO = z.object({
  tipo_id: optionalNumber(UsuarioSchema.tipo_id),
  nombre: optionalString(UsuarioSchema.nombre),
  email: optionalString(UsuarioSchema.email),
  password: optionalString(UsuarioSchema.password) // <-- CORRECCIÓN CLAVE
});

module.exports = { UsuarioDTO, UsuarioUpdateDTO };