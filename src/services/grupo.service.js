const { Grupo, Carrera, Semestre } = require("../models");

class GrupoService {
  async listar() {
    return await Grupo.findAll({
      include: [
        { model: Carrera, as: "carrera", attributes: ["nombre"] },
        { model: Semestre, as: "semestre", attributes: ["numero"] },
      ],
    });
  }

  async seleccionar(id) {
    return await Grupo.findByPk(id, {
      include: [
        { model: Carrera, as: "carrera", attributes: ["nombre"] },
        { model: Semestre, as: "semestre", attributes: ["numero"] },
      ],
    });
  }

  async crear(data) {
    return await Grupo.create(data);
  }

  async editar(id, data) {
    const grupo = await Grupo.findByPk(id);
    if (!grupo) return null;
    return await grupo.update(data);
  }

  async eliminar(id) {
    const grupo = await Grupo.findByPk(id);
    if (!grupo) return null;
    await grupo.destroy();
    return grupo;
  }
}

module.exports = new GrupoService();
