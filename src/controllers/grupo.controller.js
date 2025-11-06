const grupoService = require("../services/grupo.service");
const {GrupoDTO, GrupoUpdateDTO} = require("../dtos/grupo.dto");


class GrupoController {
  async listar(req, res, next) {
    try {
      const grupos = await grupoService.listar();
      res.json(grupos);
    } catch (error) {
      next(error);
    }
  }

  async seleccionar(req, res, next) {
    try {
      const grupo = await grupoService.seleccionar(req.params.id);
      if (!grupo) return res.status(404).json({ message: "Grupo no encontrado" });
      res.json(grupo);
    } catch (error) {
      next(error);
    }
  }

  async crear(req, res, next) {
    try {
      const validatedData = GrupoDTO.parse(req.body);
      const grupo = await grupoService.crear(validatedData);
      res.status(201).json(grupo);
    } catch (error) {
      next(error);
    }
  }

  async editar(req, res, next) {
    try {
      const validatedData = GrupoUpdateDTO.parse(req.body);
      const grupo = await grupoService.editar(req.params.id, validatedData);
      if (!grupo) return res.status(404).json({ message: "Grupo no encontrado" });
      res.json(grupo);
    } catch (error) {
      next(error);
    }
  }

  async eliminar(req, res, next) {
    try {
      const grupo = await grupoService.eliminar(req.params.id);
      if (!grupo) return res.status(404).json({ message: "Grupo no encontrado" });
      res.json({ message: "Grupo eliminado correctamente" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new GrupoController();
