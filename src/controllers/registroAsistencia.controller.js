const registroAsistenciaService = require("../services/registroAsistencia.service");
const {RegistroAsistenciaDTO, RegistroAsistenciaUpdateDTO} = require("../dtos/registroAsistencia.dto");

class RegistroAsistenciaController {
  async listar(req, res, next) {
    try {
      const registros = await registroAsistenciaService.listar();
      res.json(registros);
    } catch (error) {
      next(error);
    }
  }

  async seleccionar(req, res, next) {
    try {
      const registro = await registroAsistenciaService.seleccionar(req.params.id);
      if (!registro) return res.status(404).json({ message: "Registro de asistencia no encontrado" });
      res.json(registro);
    } catch (error) {
      next(error);
    }
  }

  async crear(req, res, next) {
    try {
      const validatedData = RegistroAsistenciaDTO.parse(req.body);
      const registro = await registroAsistenciaService.crear(validatedData);
      res.status(201).json(registro);
    } catch (error) {
      next(error);
    }
  }

  async editar(req, res, next) {
    try {
      const validatedData = RegistroAsistenciaUpdateDTO.parse(req.body);
      const registro = await registroAsistenciaService.editar(req.params.id, validatedData);
      if (!registro) return res.status(404).json({ message: "Registro de asistencia no encontrado" });
      res.json(registro);
    } catch (error) {
      next(error);
    }
  }

  async eliminar(req, res, next) {
    try {
      const registro = await registroAsistenciaService.eliminar(req.params.id);
      if (!registro) return res.status(404).json({ message: "Registro de asistencia no encontrado" });
      res.json({ message: "Registro de asistencia eliminado correctamente" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RegistroAsistenciaController();
