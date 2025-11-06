const { Semestre } = require("../models");

class SemestreService {
  async listar() {
    return await Semestre.findAll();
  }

  async seleccionar(id) {
    return await Semestre.findByPk(id);
  }

  async crear(data) {
    return await Semestre.create(data);
  }

  async editar(id, data) {
    const semestre = await Semestre.findByPk(id);
    if (!semestre) return null;
    return await semestre.update(data);
  }

  async eliminar(id) {
    const semestre = await Semestre.findByPk(id);
    if (!semestre) return null;
    await semestre.destroy();
    return semestre;
  }
}

module.exports = new SemestreService();
