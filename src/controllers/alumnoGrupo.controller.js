const AlumnoGrupoService = require("../services/alumnoGrupo.service");
const {AlumnoGrupoDTO, AlumnoGrupoUpdateDTO} = require("../dtos/alumnoGrupo.dto");

class AlumnoGrupoController {
  async listar(req, res, next) {
    try {
      console.log("Llego al controller");
      const data = await AlumnoGrupoService.listar();
      console.log(data);
      
      res.json({ success: true, data });
    } catch (error) {
      console.error("Error al listar alumno_grupo:", error);
      next(error);
    }
  }

  async seleccionar(req, res) {
    try {
      const { id } = req.params;
      const data = await AlumnoGrupoService.seleccionar(id);
      if (!data) return res.status(404).json({ error: "No encontrado" });
      res.json({ success: true, data });
    } catch (error) {
      console.error("Error al seleccionar alumno_grupo:", error);
      next(error);
    }
  }

  async crear(req, res) {
    try {
      const validatedData = AlumnoGrupoDTO.parse(req.body);
      const nuevo = await AlumnoGrupoService.crear(validatedData);
      res.status(201).json({ success: true, data: nuevo });
    } catch (error) {
      console.error("Error al crear alumno_grupo:", error);
      next(error);
    }
  }

  async editar(req, res) {
    try {
      const validatedData = AlumnoGrupoUpdateDTO.parse(req.body);
      const actualizado = await AlumnoGrupoService.editar(req.params.id, validatedData);
      if (!actualizado) return res.status(404).json({ error: "No encontrado" });
      res.json({ success: true, data: actualizado });
    } catch (error) {
      console.error("Error al editar alumno_grupo:", error);
      next(error);
    }
  }

  async eliminar(req, res) {
    try {
      const { id } = req.params;
      const eliminado = await AlumnoGrupoService.eliminar(id);
      if (!eliminado) return res.status(404).json({ error: "No encontrado" });
      res.json({ success: true, message: "Eliminado correctamente" });
    } catch (error) {
      console.error("Error al eliminar alumno_grupo:", error);
      next(error);
    }
  }
};

module.exports = new AlumnoGrupoController();
