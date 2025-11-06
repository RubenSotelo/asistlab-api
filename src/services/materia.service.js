const { Materia, Carrera, Semestre } = require("../models");

class MateriaService {
  async listar() {
    return await Materia.findAll({
      include: [
        { model: Carrera, as: "carrera" },
        { model: Semestre, as: "semestre" },
      ],
    });
  }

  async seleccionar(id) {
    return await Materia.findByPk(id, {
      include: [
        { model: Carrera, as: "carrera" },
        { model: Semestre, as: "semestre" },
      ],
    });
  }

  async crear(data) {
    return await Materia.create(data);
  }

  async editar(id, data) {
    const materia = await Materia.findByPk(id);
    if (!materia) return null;
    return await materia.update(data);
  }

  async eliminar(id) {
    const materia = await Materia.findByPk(id);
    if (!materia) return null;
    await materia.destroy();
    return materia;
  }
}

module.exports = new MateriaService();
