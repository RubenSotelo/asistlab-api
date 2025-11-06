const { Carrera } = require("../models");

class CarreraService {
  async listar() {
    return await Carrera.findAll({ attributes: ["id", "nombre"] });
  }

  async seleccionar(id) {
    return await Carrera.findByPk(id, { attributes: ["id", "nombre"] });
  }

  async crear(data) {
    return await Carrera.create(data);
  }

  async editar(id, data) {
    const carrera = await Carrera.findByPk(id);
    if (!carrera) return null;
    return await carrera.update(data);
  }

  async eliminar(id) {
    const carrera = await Carrera.findByPk(id);
    if (!carrera) return null;
    await carrera.destroy();
    return carrera;
  }
}

module.exports = new CarreraService();
