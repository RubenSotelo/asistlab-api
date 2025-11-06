const { AlumnoGrupo, Alumno } = require("../models");
const GrupoService = require("./grupo.service"); // Servicio para academica_db
const SemestreService = require("./semestre.service"); // Servicio para academica_db

class AlumnoGrupoService {
  async listar() {
    console.log("Llego al services ");
    
    const alumnoGrupos = await AlumnoGrupo.findAll({
      include: [{ model: Alumno, as: "alumno" }],
    });

    // Traemos info de grupo y semestre manualmente
    const results = await Promise.all(
      alumnoGrupos.map(async (ag) => {
        const grupo = await GrupoService.seleccionar(ag.grupo_id);
        const semestre = grupo ? await SemestreService.seleccionar(grupo.semestre_id) : null;
        return {
          ...ag.toJSON(),
          grupo,
          semestre,
        };
      })
    );

    return results;
  }

  async seleccionar(id) {
    const ag = await AlumnoGrupo.findByPk(id, {
      include: [{ model: Alumno, as: "alumno" }],
    });

    if (!ag) return null;

    const grupo = await GrupoService.seleccionar(ag.grupo_id);
    const semestre = grupo ? await SemestreService.seleccionar(grupo.semestre_id) : null;

    return {
      ...ag.toJSON(),
      grupo,
      semestre,
    };
  }

  async crear(data) {
    return await AlumnoGrupo.create(data);
  }

  async editar(id, data) {
    const ag = await AlumnoGrupo.findByPk(id);
    if (!ag) return null;
    return await ag.update(data);
  }

  async eliminar(id) {
    const ag = await AlumnoGrupo.findByPk(id);
    if (!ag) return null;
    await ag.destroy();
    return ag;
  }
}

module.exports = new AlumnoGrupoService();
