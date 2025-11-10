// src/controllers/profesor.controller.js
const { Sesion, Grupo, Materia, Laboratorio, authDb } = require("../models"); 
const { Op } = require("sequelize"); // No necesitamos 'Sequelize' aquí
const moment = require("moment-timezone"); 

class ProfesorController {
  
  async getGruposPorProfesor(req, res, next) {
    try {
      const profesorId = parseInt(req.params.id, 10);
      if (isNaN(profesorId)) {
        return res.status(400).json({ error: "ID de profesor inválido" });
      }
      
      const sesiones = await Sesion.findAll({
        attributes: ['grupo_id'],
        where: { profesor_id: profesorId },
        group: ['grupo_id']
      });

      if (!sesiones || sesiones.length === 0) {
        return res.json([]);
      }
      
      const grupoIds = sesiones.map(s => s.grupo_id);
      
      const grupos = await Grupo.findAll({
        where: { id: { [Op.in]: grupoIds } }
      });
      
      const resultado = await Promise.all(grupos.map(async (g) => {
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

  async getSesionesPorGrupo(req, res, next) {
    try {
      const profesorId = parseInt(req.params.id, 10);
      const grupoId = parseInt(req.params.grupoId, 10);

      const sesiones = await Sesion.findAll({
        where: {
          profesor_id: profesorId,
          grupo_id: grupoId
        },
        order: [['fecha', 'DESC']]
      });

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

  getIconForMateria(materia) {
    if (!materia) return 'book-outline';
    const lower = materia.toLowerCase();
    if (lower.includes('datos')) return 'git-network-outline';
    if (lower.includes('base de datos')) return 'server-outline';
    if (lower.includes('redes')) return 'hardware-chip-outline';
    if (lower.includes('cálculo')) return 'calculator-outline';
    return 'book-outline';
  }

  async getDashboardData(req, res, next) {
    try {
      const profesorId = parseInt(req.params.id, 10);
      if (isNaN(profesorId)) {
        return res.status(400).json({ error: "ID de profesor inválido" });
      }

      // --- 1. Obtener Grupos Asignados ---
      const gruposSesiones = await Sesion.findAll({
        attributes: ['grupo_id'],
        where: { profesor_id: profesorId },
        group: ['grupo_id']
      });
      const gruposAsignados = gruposSesiones.length;


      // ✅ --- INICIO DE LA CORRECCIÓN ---
      // Revertimos a la consulta de fecha que SÍ funciona.
      // Esta consulta obtiene la fecha de 'hoy' (2025-11-09)
      const todayResult = await authDb.query(
        "SELECT (CURRENT_DATE AT TIME ZONE 'America/Mexico_City') AS today"
      );
      const today = todayResult[0][0].today.split('T')[0];
      
      // Añadimos un log claro para depurar
      console.log(`[Dashboard Prof: ${profesorId}] Buscando sesiones para la fecha: ${today}`);
      // ✅ --- FIN DE LA CORRECCIÓN ---


      // --- 3. Obtener Sesiones de Hoy ---
      const sesionesHoyRaw = await Sesion.findAll({
        where: {
          profesor_id: profesorId,
          fecha: today // Usamos el string de fecha "2025-11-09"
        },
        order: [['hora_inicio', 'ASC']]
      });

      // --- 4. Enriquecer Sesiones de Hoy ---
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

      // --- 5. Calcular Próxima Sesión ---
      const ahora = moment().tz("America/Mexico_City");
      let proximaSesionEnHoras = 0;
      
      const proximaSesion = sesionesHoy.find(s => {
        const horaInicio = moment.tz(`${today}T${s.hora_inicio}`, "America/Mexico_City");
        return horaInicio.isAfter(ahora);
      });

      if (proximaSesion) {
        const horaInicio = moment.tz(`${today}T${proximaSesion.hora_inicio}`, "America/Mexico_City");
        proximaSesionEnHoras = parseFloat(horaInicio.diff(ahora, 'hours', true).toFixed(1));
      }

      // --- 6. Construir Respuesta ---
      const dashboardData = {
        stats: {
          gruposAsignados: gruposAsignados,
          sesionesHoy: sesionesHoy.length, // Esto ahora debería ser 1
          proximaSesionEnHoras: proximaSesionEnHoras
        },
        sesionesHoy: sesionesHoy
      };

      res.json(dashboardData);
    } catch (error) {
      // ✅ Capturamos el error y lo enviamos al log
      console.error("[ERROR] en getDashboardData:", error);
      next(error);
    }
  }
}

module.exports = new ProfesorController();