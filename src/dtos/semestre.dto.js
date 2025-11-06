const { z } = require("zod");
const { optionalNumber } = require("./dto.helper");

const SemestreSchema = {
  numero: z.number({
    required_error: "El número de semestre es obligatorio",
    invalid_type_error: "El semestre debe ser un número",
  }).int().positive("El semestre debe ser mayor a 0"),
};

const SemestreDTO = z.object(SemestreSchema);

const SemestreUpdateDTO = z.object({
  numero: optionalNumber(SemestreSchema.numero)
});

module.exports = {SemestreDTO, SemestreUpdateDTO};