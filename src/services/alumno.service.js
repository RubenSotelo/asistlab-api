const { Alumno, AlumnoGrupo } = require('../models');

class AlumnoService {
  async listar() {
    return await Alumno.findAll();
  }

  async seleccionar(id) {
    return await Alumno.findByPk(id);
  }

  async crear(data) {
    return await Alumno.create(data);
  }

  async editar(id, data) {
    const alumno = await Alumno.findByPk(id);
    if (!alumno) return null;
    return await alumno.update(data);
  }

  async eliminar(id) {
    const alumno = await Alumno.findByPk(id);
    if (!alumno) return null;
    await alumno.destroy();
    return alumno;
  }

  async obtenerGrupos(alumnoId) {
    return await AlumnoGrupo.findAll({ where: { alumno_id: alumnoId } });
  }
}

module.exports = new AlumnoService();
