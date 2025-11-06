const { z } = require("zod");
const { optionalString } = require("./dto.helper");

const TipoSchema = {
  nombre: z.string()
    .min(1, "El nombre es obligatorio")
    .max(50, "El nombre no puede superar 50 caracteres"),
};

const TipoDTO = z.object(TipoSchema);

const TipoUpdateDTO = z.object({
  nombre: optionalString(TipoSchema.nombre)
});

module.exports = {TipoDTO, TipoUpdateDTO};