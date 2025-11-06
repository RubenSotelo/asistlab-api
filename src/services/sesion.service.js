const { Sesion, Laboratorio, Usuario, Grupo, Materia } = require("../models");

class SesionService {
  // 📋 Listar todas las sesiones
  async listar() {
    // Incluimos solo Laboratorio (misma DB)
    const sesiones = await Sesion.findAll({
      raw: true,
      nest: true
    });

    // 🔗 Enriquecer datos de otras bases (manual)
    const sesionesConDatos = await Promise.all(
      sesiones.map(async (sesion) => {
        const laboratorio = await Laboratorio.findByPk(sesion.laboratorio_id);
        const profesor = await Usuario.findByPk(sesion.profesor_id);
        const grupo = await Grupo.findByPk(sesion.grupo_id);
        const materia = await Materia.findByPk(sesion.materia_id);

        return {
          ...sesion,
          laboratorio: laboratorio ? laboratorio.nombre : null,
          profesor: profesor ? profesor.nombre : null,
          grupo: grupo ? grupo.nombre : null,
          materia: materia ? materia.nombre : null
        };
      })
    );

    return sesionesConDatos;
  }

  // 📌 Obtener sesión por ID
  async seleccionar(id) {
    const sesion = await Sesion.findByPk(id, {
      include: [{ model: Laboratorio, as: "laboratorio" }],
      raw: true,
      nest: true
    });

    if (!sesion) return null;

    const profesor = await Usuario.findByPk(sesion.profesor_id);
    const grupo = await Grupo.findByPk(sesion.grupo_id);
    const materia = await Materia.findByPk(sesion.materia_id);

    return {
      ...sesion,
      profesor: profesor ? profesor.nombre : null,
      grupo: grupo ? grupo.nombre : null,
      materia: materia ? materia.nombre : null
    };
  }

  async crear(data) {
    return await Sesion.create(data);
  }

  async editar(id, data) {
    const sesion = await Sesion.findByPk(id);
    if (!sesion) return null;
    return await sesion.update(data);
  }

  async eliminar(id) {
    const sesion = await Sesion.findByPk(id);
    if (!sesion) return null;
    await sesion.destroy();
    return sesion;
  }
}

module.exports = new SesionService();
