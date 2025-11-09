// src/controllers/alumno.controller.js
const alumnoService = require("../services/alumno.service");
const { AlumnoDTO, AlumnoUpdateDTO } = require("../dtos/alumno.dto");
const { 
  AlumnoGrupo, RegistroAsistencia, Sesion, 
  Materia, Laboratorio 
} = require("../models");
const { Op } = require("sequelize");
const moment = require("moment-timezone"); // Para manejar fechas

class AlumnoController {
  
  // --- Métodos CRUD de Admin (existentes) ---
  
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
      // Este método es llamado por el frontend de REGISTRO
      const validatedData = AlumnoDTO.parse(req.body);
      const alumno = await alumnoService.crear(validatedData);
      res.status(201).json(alumno);
    } catch (error) {
      // Manejo de error de matrícula duplicada
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({
          error: 'La matrícula ya está registrada',
          code: 'MATRICULA_EXISTS',
        });
      }
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

  // ✅ --- INICIO DE NUEVOS MÉTODOS (Para Alumno) ---

  /**
   * Obtiene los datos del Dashboard del Alumno
   * @route GET /api/v1/alumnos/:id/dashboard-data
   */
  async getDashboardData(req, res, next) {
    try {
      const { id: alumnoId } = req.params;
      const today = moment().tz("America/Mexico_City").format("YYYY-MM-DD");
      const now = moment().tz("America/Mexico_City").format("HH:mm:ss");

      // 1. Obtener Estadísticas
      const totalAsistencias = await RegistroAsistencia.count({
        where: { alumno_id: alumnoId, presente: true }
      });
      const totalFaltas = await RegistroAsistencia.count({
        where: { alumno_id: alumnoId, presente: false }
      });
      const totalRegistros = totalAsistencias + totalFaltas;
      const porcentajeAsistencia = totalRegistros > 0 
        ? parseFloat(((totalAsistencias / totalRegistros) * 100).toFixed(1)) 
        : 0;

      // 2. Obtener Próxima Clase
      const gruposAlumno = await AlumnoGrupo.findAll({
        where: { alumno_id: alumnoId, activo: true },
        attributes: ['grupo_id']
      });
      const grupoIds = gruposAlumno.map(g => g.grupo_id);
      
      let proximaClase = null;
      if (grupoIds.length > 0) {
        const sesion = await Sesion.findOne({
          where: {
            grupo_id: { [Op.in]: grupoIds },
            fecha: { [Op.gte]: today }, // Hoy o en el futuro
            [Op.or]: [
              { fecha: { [Op.gt]: today } }, // Sesiones de días futuros
              { 
                [Op.and]: [ // Sesiones de hoy que no han terminado
                  { fecha: today },
                  { hora_fin: { [Op.gt]: now } } 
                ]
              }
            ]
          },
          order: [['fecha', 'ASC'], ['hora_inicio', 'ASC']],
        });

        if (sesion) {
          const materia = await Materia.findByPk(sesion.materia_id);
          const laboratorio = await Laboratorio.findByPk(sesion.laboratorio_id);
          proximaClase = {
            materia: materia ? materia.nombre : 'N/A',
            laboratorio: laboratorio ? laboratorio.nombre : 'N/A',
            horario: `${sesion.hora_inicio} - ${sesion.hora_fin || '??'}`,
            fecha: sesion.fecha
          };
        }
      }

      // 3. Obtener Actividad Reciente (Últimos 3 registros)
      const registrosRecientes = await RegistroAsistencia.findAll({
        where: { alumno_id: alumnoId },
        limit: 3,
        order: [['created_at', 'DESC']]
      });

      const actividadReciente = await Promise.all(
        registrosRecientes.map(async (r) => {
          const sesion = await Sesion.findByPk(r.sesion_id);
          const materia = sesion ? await Materia.findByPk(sesion.materia_id) : null;
          return {
            id: r.id,
            materia: materia ? materia.nombre : 'N/A',
            fecha: r.created_at, // Fecha del registro
            hora: r.hora_llegada || (r.presente ? 'Registrado' : '--'),
            presente: r.presente
          };
        })
      );
      
      // 4. Enviar respuesta
      res.json({
        totalAsistencias,
        totalFaltas,
        porcentajeAsistencia,
        proximaClase,
        actividadReciente
      });

    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtiene el Historial de Asistencia del Alumno
   * @route GET /api/v1/alumnos/:id/historial-data
   */
  async getHistorialData(req, res, next) {
    try {
      const { id: alumnoId } = req.params;

      // 1. Obtener Estadísticas (igual que en dashboard)
      const totalAsistencias = await RegistroAsistencia.count({
        where: { alumno_id: alumnoId, presente: true }
      });
      const totalFaltas = await RegistroAsistencia.count({
        where: { alumno_id: alumnoId, presente: false }
      });
      const totalRegistros = totalAsistencias + totalFaltas;
      const porcentajeAsistencia = totalRegistros > 0 
        ? parseFloat(((totalAsistencias / totalRegistros) * 100).toFixed(1)) 
        : 0;

      const stats = { totalAsistencias, totalFaltas, porcentajeAsistencia };

      // 2. Obtener Historial Completo
      const registros = await RegistroAsistencia.findAll({
        where: { alumno_id: alumnoId },
        order: [['created_at', 'DESC']]
      });

      const historial = await Promise.all(
        registros.map(async (r) => {
          const sesion = await Sesion.findByPk(r.sesion_id);
          if (!sesion) return null; // Si la sesión fue borrada
          
          const materia = await Materia.findByPk(sesion.materia_id);
          const laboratorio = await Laboratorio.findByPk(sesion.laboratorio_id);
          
          return {
            id: r.id,
            materia: materia ? materia.nombre : 'N/A',
            fecha: sesion.fecha,
            hora: r.hora_llegada || (r.presente ? 'Registrado' : '--'),
            presente: r.presente,
            laboratorio: laboratorio ? laboratorio.nombre : 'N/A'
          };
        })
      );
      
      res.json({
        stats,
        historial: historial.filter(Boolean) // Filtrar nulos
      });

    } catch (error) {
      next(error);
    }
  }
  
  // ✅ --- FIN DE NUEVOS MÉTODOS ---
}

module.exports = new AlumnoController();