// src/controllers/profesor.controller.js
const { Sesion, Grupo, Materia, Laboratorio } = require("../models");
const { Op } = require("sequelize");
const moment = require("moment-timezone"); // Para manejar la fecha de "hoy"

/*
 * Este es un controlador nuevo para centralizar la lógica
 * que es específica del rol de Profesor.
 */
class ProfesorController {
  
  /**
   * Obtiene los grupos asignados a un profesor.
   * Busca en todas las sesiones (laboratoriosDb) donde aparece el profesor_id,
   * extrae los grupo_id únicos y luego consulta los detalles de esos
   * grupos (academicaDb).
   */
  async getGruposPorProfesor(req, res, next) {
    try {
      const { id: profesorId } = req.params;

      // 1. Encontrar todos los grupo_id únicos que este profesor tiene en sus sesiones
      const sesiones = await Sesion.findAll({
        attributes: ['grupo_id'],
        where: { profesor_id: profesorId },
        group: ['grupo_id']
      });

      if (!sesiones || sesiones.length === 0) {
        return res.json([]);
      }
      
      const grupoIds = sesiones.map(s => s.grupo_id);

      // 2. Buscar los detalles de esos grupos
      const grupos = await Grupo.findAll({
        where: { id: { [Op.in]: grupoIds } }
      });

      // 3. Formatear como lo espera el frontend
      const resultado = await Promise.all(grupos.map(async (g) => {
        // Necesitamos encontrar la materia para este grupo (puede variar por sesión)
        // Por simplicidad, tomamos la primera materia asociada a las sesiones de este grupo
        const sesionConMateria = await Sesion.findOne({
          where: { profesor_id: profesorId, grupo_id: g.id },
          attributes: ['materia_id'],
          limit: 1
        });
        
        const materia = sesionConMateria ? await Materia.findByPk(sesionConMateria.materia_id) : null;

        return {
          id: g.id,
          nombre: `Grupo ${g.nombre}`,
          materia: materia ? materia.nombre : 'Materia no asignada'
        };
      }));

      res.json(resultado);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtiene las sesiones (clases) de un profesor para un grupo específico.
   */
  async getSesionesPorGrupo(req, res, next) {
    try {
      const { id: profesorId, grupoId } = req.params;

      const sesiones = await Sesion.findAll({
        where: {
          profesor_id: profesorId,
          grupo_id: grupoId
        },
        order: [['fecha', 'DESC']]
      });

      // Formatear como lo espera el frontend
      const resultado = sesiones.map(s => ({
        id: s.id,
        fecha: s.fecha,
        horario: `${s.hora_inicio} - ${s.hora_fin || '??'}`,
        materia: '',
        laboratorio: ''
      }));
      
      res.json(resultado);
    } catch (error) {
      next(error);
    }
  }

  // ✅ --- INICIO DE NUEVO MÉTODO ---

  // Helper para replicar la lógica de íconos del frontend
  getIconForMateria(materia) {
    if (!materia) return 'book-outline';
    const lower = materia.toLowerCase();
    if (lower.includes('datos')) return 'git-network-outline';
    if (lower.includes('base de datos')) return 'server-outline';
    if (lower.includes('redes')) return 'hardware-chip-outline';
    if (lower.includes('cálculo')) return 'calculator-outline';
    return 'book-outline';
  }

  /**
   * @route GET /api/v1/profesores/:id/dashboard-data
   * Obtiene todos los datos para el dashboard del profesor.
   */
  async getDashboardData(req, res, next) {
    try {
      const { id: profesorId } = req.params;

      // --- 1. Obtener Grupos Asignados (Reutilizar lógica) ---
      const gruposSesiones = await Sesion.findAll({
        attributes: ['grupo_id'],
        where: { profesor_id: profesorId },
        group: ['grupo_id']
      });
      const gruposAsignados = gruposSesiones.length;

      // --- 2. Obtener Sesiones de Hoy ---
      // Usar moment para obtener la fecha de hoy (en la zona horaria correcta)
      const today = moment().tz("America/Mexico_City").format("YYYY-MM-DD");
      
      const sesionesHoyRaw = await Sesion.findAll({
        where: {
          profesor_id: profesorId,
          fecha: today // Compara solo con la fecha
        },
        order: [['hora_inicio', 'ASC']]
      });

      // --- 3. Enriquecer Sesiones de Hoy ---
      const sesionesHoy = await Promise.all(
        sesionesHoyRaw.map(async (s) => {
          const materia = await Materia.findByPk(s.materia_id);
          const laboratorio = await Laboratorio.findByPk(s.laboratorio_id);
          const grupo = await Grupo.findByPk(s.grupo_id);
          const materiaNombre = materia ? materia.nombre : 'N/A';
          return {
            id: s.id,
            materia: materiaNombre,
            laboratorio: laboratorio ? laboratorio.nombre : 'N/A',
            horario: `${s.hora_inicio} - ${s.hora_fin || '??'}`,
            hora_inicio: s.hora_inicio,
            grupo: grupo ? `Grupo ${grupo.nombre}` : 'N/A',
            icono: this.getIconForMateria(materiaNombre)
          };
        })
      );

      // --- 4. Calcular Próxima Sesión ---
      const ahora = moment().tz("America/Mexico_City");
      let proximaSesionEnHoras = 0;
      
      const proximaSesion = sesionesHoy.find(s => {
        // Compara la hora de inicio de la sesión con la hora actual
        const horaInicio = moment.tz(`${today}T${s.hora_inicio}`, "America/Mexico_City");
        return horaInicio.isAfter(ahora);
      });

      if (proximaSesion) {
        const horaInicio = moment.tz(`${today}T${proximaSesion.hora_inicio}`, "America/Mexico_City");
        // Devuelve la diferencia en horas (ej: 1.5)
        proximaSesionEnHoras = parseFloat(horaInicio.diff(ahora, 'hours', true).toFixed(1));
      }

      // --- 5. Construir Respuesta ---
      const dashboardData = {
        stats: {
          gruposAsignados: gruposAsignados,
          sesionesHoy: sesionesHoy.length,
          proximaSesionEnHoras: proximaSesionEnHoras
        },
        sesionesHoy: sesionesHoy
      };

      res.json(dashboardData);
    } catch (error) {
      next(error);
    }
  }
  // ✅ --- FIN DE NUEVO MÉTODO ---
}

module.exports = new ProfesorController();