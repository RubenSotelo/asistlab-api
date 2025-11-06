const semestreService = require("../services/semestre.service");
const {SemestreDTO, SemestreUpdateDTO} = require("../dtos/semestre.dto");

class SemestreController {
  async listar(req, res, next) {
    try {
      const semestres = await semestreService.listar();
      res.json(semestres);
    } catch (error) {
      next(error);
    }
  }

  async seleccionar(req, res, next) {
    try {
      const semestre = await semestreService.seleccionar(req.params.id);
      if (!semestre) return res.status(404).json({ message: "Semestre no encontrado" });
      res.json(semestre);
    } catch (error) {
      next(error);
    }
  }

  async crear(req, res, next) {
    try {
      const validatedData = SemestreDTO.parse(req.body);
      const semestre = await semestreService.crear(validatedData);
      res.status(201).json(semestre);
    } catch (error) {
      next(error);
    }
  }

  async editar(req, res, next) {
    try {
      const validatedData = SemestreUpdateDTO.parse(req.body);
      const semestre = await semestreService.editar(req.params.id, validatedData);
      if (!semestre) return res.status(404).json({ message: "Semestre no encontrado" });
      res.json(semestre);
    } catch (error) {
      next(error);
    }
  }

  async eliminar(req, res, next) {
    try {
      const semestre = await semestreService.eliminar(req.params.id);
      if (!semestre) return res.status(404).json({ message: "Semestre no encontrado" });
      res.json({ message: "Semestre eliminado correctamente" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SemestreController();
