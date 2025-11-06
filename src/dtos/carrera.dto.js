const { z } = require("zod");
const { optionalString } = require("./dto.helper");

const CarreraSchema = {
  nombre: z.string()
    .min(1, "El nombre es obligatorio")
    .max(150, "El nombre no puede superar 150 caracteres"),
};

const CarreraDTO = z.object(CarreraSchema);

const CarreraUpdateDTO = z.object({
  nombre: optionalString(CarreraSchema.nombre)
});

module.exports = {CarreraDTO, CarreraUpdateDTO};