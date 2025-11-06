const sesionService = require("../services/sesion.service");
const {SesionDTO, SesionUpdateDTO} = require("../dtos/sesion.dto");

class SesionController {
  async listar(req, res, next) {
    try {
      const sesiones = await sesionService.listar();
      res.json(sesiones);
    } catch (error) {
      next(error);
    }
  }

  async seleccionar(req, res, next) {
    try {
      const sesion = await sesionService.seleccionar(req.params.id);
      if (!sesion) return res.status(404).json({ message: "Sesión no encontrada" });
      res.json(sesion);
    } catch (error) {
      next(error);
    }
  }

  async crear(req, res, next) {
    try {
      const validatedData = SesionDTO.parse(req.body);
      const sesion = await sesionService.crear(validatedData);
      res.status(201).json(sesion);
    } catch (error) {
      next(error);
    }
  }

  async editar(req, res, next) {
    try {
      const validatedData = SesionUpdateDTO.parse(req.body);
      const sesion = await sesionService.editar(req.params.id, validatedData);
      if (!sesion) return res.status(404).json({ message: "Sesión no encontrada" });
      res.json(sesion);
    } catch (error) {
      next(error);
    }
  }

  async eliminar(req, res, next) {
    try {
      const sesion = await sesionService.eliminar(req.params.id);
      if (!sesion) return res.status(404).json({ message: "Sesión no encontrada" });
      res.json({ message: "Sesión eliminada correctamente" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SesionController();
