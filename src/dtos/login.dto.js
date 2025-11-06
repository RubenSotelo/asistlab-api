const { z } = require("zod");

const LoginDTO = z.object({
  email: z.string()
    .max(150, "El email no puede superar 150 caracteres")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Formato de correo inválido"),
  password: z.string()
    .min(1, "La contraseña es requerida")
});

module.exports = LoginDTO;