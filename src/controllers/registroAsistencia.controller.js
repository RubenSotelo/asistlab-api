// src/controllers/registroAsistencia.controller.js
const registroAsistenciaService = require("../services/registroAsistencia.service");
const {RegistroAsistenciaDTO, RegistroAsistenciaUpdateDTO} = require("../dtos/registroAsistencia.dto");
const databaseHelpers = require("../utils/databaseHelpers"); 

class RegistroAsistenciaController {
  
  // ... (métodos listar, seleccionar, crear, editar, eliminar que ya tenías) ...
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
      if (!registro) return res.status(404).json({ message: "Registro de asistencia eliminado correctamente" });
      res.json({ message: "Registro de asistencia eliminado correctamente" });
    } catch (error) {
      next(error);
    }
  }

  // ... (método registrarPorQR que añadimos en el PASO 1) ...
  async registrarPorQR(req, res, next) {
    try {
      const { qrData, matricula } = req.body;

      if (!qrData || !matricula) {
        return res.status(400).json({
          error: "Faltan datos (qrData, matricula)",
          code: "BAD_REQUEST",
        });
      }

      const resultado = await databaseHelpers.registrarAsistenciaAutomatica(qrData, matricula);

      if (!resultado.success) {
        return res.status(409).json({
          error: resultado.message,
          code: resultado.error,
        });
      }
      res.status(201).json(resultado);

    } catch (error) {
      next(error);
    }
  }

  // ✅ --- INICIO DE NUEVO MÉTODO ---
  /**
   * Actualiza el estado de asistencia (Presente, Ausente, Justificado)
   * por parte de un profesor.
   */
  async actualizarEstado(req, res, next) {
    try {
      const { id } = req.params;
      const { estado } = req.body; // 'Presente', 'Ausente', 'Justificado'

      if (!estado) {
         return res.status(400).json({ error: "El 'estado' es requerido" });
      }

      const registro = await registroAsistenciaService.actualizarEstado(id, estado);
      res.json({ success: true, registro });
    } catch (error) {
      next(error);
    }
  }
  // ✅ --- FIN DE NUEVO MÉTODO ---
}

module.exports = new RegistroAsistenciaController();