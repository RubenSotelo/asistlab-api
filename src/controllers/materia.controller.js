const materiaService = require("../services/materia.service");
const {MateriaDTO, MateriaUpdateDTO} = require("../dtos/materia.dto");

class MateriaController {
  async listar(req, res, next) {
    try {
      const materias = await materiaService.listar();
      res.json(materias);
    } catch (error) {
      next(error);
    }
  }

  async seleccionar(req, res, next) {
    try {
      const materia = await materiaService.seleccionar(req.params.id);
      if (!materia) return res.status(404).json({ message: "Materia no encontrada" });
      res.json(materia);
    } catch (error) {
      next(error);
    }
  }

  async crear(req, res, next) {
    try {
      const validatedData = MateriaDTO.parse(req.body);
      const materia = await materiaService.crear(validatedData);
      res.status(201).json(materia);
    } catch (error) {
      next(error);
    }
  }

  async editar(req, res, next) {
    try {
      const validatedData = MateriaUpdateDTO.parse(req.body);
      const materia = await materiaService.editar(req.params.id, validatedData);
      if (!materia) return res.status(404).json({ message: "Materia no encontrada" });
      res.json(materia);
    } catch (error) {
      next(error);
    }
  }

  async eliminar(req, res, next) {
    try {
      const materia = await materiaService.eliminar(req.params.id);
      if (!materia) return res.status(404).json({ message: "Materia no encontrada" });
      res.json({ message: "Materia eliminada correctamente" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MateriaController();
