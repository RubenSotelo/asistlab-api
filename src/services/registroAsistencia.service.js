const { RegistroAsistencia } = require("../models");

class RegistroAsistenciaService {
  async listar() {
    // ✅ solo devuelve el modelo base
    return await RegistroAsistencia.findAll();
  }

  async seleccionar(id) {
    return await RegistroAsistencia.findByPk(id);
  }

  async crear(data) {
    return await RegistroAsistencia.create(data);
  }

  async editar(id, data) {
    const registro = await RegistroAsistencia.findByPk(id);
    if (!registro) return null;
    return await registro.update(data);
  }

  async eliminar(id) {
    const registro = await RegistroAsistencia.findByPk(id);
    if (!registro) return null;
    await registro.destroy();
    return registro;
  }
}

module.exports = new RegistroAsistenciaService();
