const { Laboratorio, Sesion } = require("../models");

class LaboratorioService {
  async listar() {
    return await Laboratorio.findAll({
      include: [{ model: Sesion, as: "sesiones" }],
    });
  }

  async seleccionar(id) {
    return await Laboratorio.findByPk(id, {
      include: [{ model: Sesion, as: "sesiones" }],
    });
  }

  async crear(data) {
    return await Laboratorio.create(data);
  }

  async editar(id, data) {
    const laboratorio = await Laboratorio.findByPk(id);
    if (!laboratorio) return null;
    return await laboratorio.update(data);
  }

  async eliminar(id) {
    const laboratorio = await Laboratorio.findByPk(id);
    if (!laboratorio) return null;
    await laboratorio.destroy();
    return laboratorio;
  }
}

module.exports = new LaboratorioService();
