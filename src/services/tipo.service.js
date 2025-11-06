const { Tipo } = require("../models");

class TipoService {
  async listar() {
    return await Tipo.findAll();
  }

  async seleccionar(id) {
    return await Tipo.findByPk(id);
  }

  async crear(data) {
    return await Tipo.create(data);
  }

  async editar(id, data) {
    const tipo = await Tipo.findByPk(id);
    if (!tipo) return null;
    return await tipo.update(data);
  }

  async eliminar(id) {
    const tipo = await Tipo.findByPk(id);
    if (!tipo) return null;
    await tipo.destroy();
    return tipo;
  }
}

module.exports = new TipoService();
