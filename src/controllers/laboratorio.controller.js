const laboratorioService = require("../services/laboratorio.service");
const {LaboratorioDTO, LaboratorioUpdateDTO} = require("../dtos/laboratorio.dto");

class LaboratorioController {
  async listar(req, res, next) {
    try {
      const laboratorios = await laboratorioService.listar();
      res.json(laboratorios);
    } catch (error) {
      next(error);
    }
  }

  async seleccionar(req, res, next) {
    try {
      const laboratorio = await laboratorioService.seleccionar(req.params.id);
      if (!laboratorio) return res.status(404).json({ message: "Laboratorio no encontrado" });
      res.json(laboratorio);
    } catch (error) {
      next(error);
    }
  }

  async crear(req, res, next) {
    try {
      const validatedData = LaboratorioDTO.parse(req.body);
      const laboratorio = await laboratorioService.crear(validatedData);
      res.status(201).json(laboratorio);
    } catch (error) {
      next(error);
    }
  }

  async editar(req, res, next) {
    try {
      const validatedData = LaboratorioUpdateDTO.parse(req.body);
      const laboratorio = await laboratorioService.editar(req.params.id, validatedData);
      if (!laboratorio) return res.status(404).json({ message: "Laboratorio no encontrado" });
      res.json(laboratorio);
    } catch (error) {
      next(error);
    }
  }

  async eliminar(req, res, next) {
    try {
      const laboratorio = await laboratorioService.eliminar(req.params.id);
      if (!laboratorio) return res.status(404).json({ message: "Laboratorio no encontrado" });
      res.json({ message: "Laboratorio eliminado correctamente" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new LaboratorioController();
