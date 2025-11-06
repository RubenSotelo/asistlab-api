const alumnoService = require("../services/alumno.service");
const {AlumnoDTO, AlumnoUpdateDTO} = require("../dtos/alumno.dto");

class AlumnoController {
  async listar(req, res, next) {
    try {
      const alumnos = await alumnoService.listar();
      res.json(alumnos);
    } catch (error) {
      next(error);
    }
  }

  async seleccionar(req, res, next) {
    try {
      const alumno = await alumnoService.seleccionar(req.params.id);
      if (!alumno) return res.status(404).json({ message: "Alumno no encontrado" });
      res.json(alumno);
    } catch (error) {
      next(error);
    }
  }

  async crear(req, res, next) {
    try {
      const validatedData = AlumnoDTO.parse(req.body);
      const alumno = await alumnoService.crear(validatedData);
      res.status(201).json(alumno);
    } catch (error) {
      next(error);
    }
  }

  async editar(req, res, next) {
    try {
      const validatedData = AlumnoUpdateDTO.parse(req.body);
      const alumno = await alumnoService.editar(req.params.id, validatedData);
      if (!alumno) return res.status(404).json({ message: "Alumno no encontrado" });
      res.json(alumno);
    } catch (error) {
      next(error);
    }
  }

  async eliminar(req, res, next) {
    try {
      const alumno = await alumnoService.eliminar(req.params.id);
      if (!alumno) return res.status(404).json({ message: "Alumno no encontrado" });
      res.json({ message: "Alumno eliminado correctamente" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AlumnoController();
