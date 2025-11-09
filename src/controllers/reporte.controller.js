// src/controllers/reporte.controller.js
const { RegistroAsistencia, Sesion, Materia, Usuario, Laboratorio } = require("../models");
const { Op } = require("sequelize");
const moment = require("moment-timezone");

/*
 * Este es un controlador nuevo para la generación de reportes.
 */
class ReporteController {

  /**
   * @route POST /api/v1/reportes/asistencia-general
   * Genera un reporte de asistencia general basado en un rango de fechas.
   * Este reporte consulta asistenciasDb, laboratoriosDb, academicaDb y authDb.
   */
  async generarReporteAsistencia(req, res, next) {
    try {
      const { fechaInicio, fechaFin, laboratorioId } = req.body;

      if (!fechaInicio || !fechaFin) {
        return res.status(400).json({ error: "Fecha de inicio y fin son requeridas" });
      }

      // 1. Definir el rango de fechas
      const startDate = moment(fechaInicio).startOf('day').toDate();
      const endDate = moment(fechaFin).endOf('day').toDate();

      // 2. Encontrar Sesiones en ese rango (Filtrando por lab si es necesario)
      const whereSesion = {
        fecha: { [Op.between]: [startDate, endDate] }
      };
      if (laboratorioId) {
        whereSesion.laboratorio_id = laboratorioId;
      }
      
      const sesionesEnRango = await Sesion.findAll({
        where: whereSesion,
        attributes: ['id', 'profesor_id', 'materia_id', 'fecha'] // Incluimos fecha
      });

      if (sesionesEnRango.length === 0) {
        // Si no hay sesiones, devolvemos un reporte vacío
        return res.json({
          estadisticas: [
            { etiqueta: 'Total Sesiones', valor: 0 },
            { etiqueta: 'Asistencias', valor: 0 },
            { etiqueta: 'Faltas', valor: 0 },
            { etiqueta: 'Tasa Asistencia', valor: '0%' }
          ],
          columnas: ['Fecha', 'Materia', 'Profesor', 'Presentes', 'Ausentes'],
          datos: []
        });
      }

      const sesionIds = sesionesEnRango.map(s => s.id);

      // 3. Obtener todos los registros de asistencia para esas sesiones
      const registros = await RegistroAsistencia.findAll({
        where: { sesion_id: { [Op.in]: sesionIds } }
      });

      // 4. Procesar Estadísticas
      const totalAsistencias = registros.filter(r => r.presente).length;
      const totalFaltas = registros.filter(r => !r.presente).length;
      const totalSesiones = sesionIds.length;
      const tasaAsistencia = (totalAsistencias + totalFaltas) > 0
        ? `${((totalAsistencias / (totalAsistencias + totalFaltas)) * 100).toFixed(0)}%`
        : '0%';

      // 5. Procesar Datos de la Tabla (agrupados por sesión)
      // (Usamos un Map para cachear profesores y materias)
      const cacheMaterias = new Map();
      const cacheProfesores = new Map();

      const datosPromesa = sesionesEnRango.map(async (sesion) => {
        // Optimizar consultas a DBs externas
        if (!cacheMaterias.has(sesion.materia_id)) {
          cacheMaterias.set(sesion.materia_id, await Materia.findByPk(sesion.materia_id));
        }
        if (!cacheProfesores.has(sesion.profesor_id)) {
          cacheProfesores.set(sesion.profesor_id, await Usuario.findByPk(sesion.profesor_id));
        }
        
        const materia = cacheMaterias.get(sesion.materia_id);
        const profesor = cacheProfesores.get(sesion.profesor_id);
        
        const registrosDeSesion = registros.filter(r => r.sesion_id === sesion.id);
        const presentes = registrosDeSesion.filter(r => r.presente).length;
        const ausentes = registrosDeSesion.filter(r => !r.presente).length;

        // Formato que espera el frontend
        return [
          sesion.fecha,
          materia ? materia.nombre : 'N/A',
          profesor ? profesor.nombre : 'N/A',
          presentes,
          ausentes
        ];
      });
      
      const datos = await Promise.all(datosPromesa);

      // 6. Enviar Respuesta
      res.json({
        estadisticas: [
          { etiqueta: 'Total Sesiones', valor: totalSesiones },
          { etiqueta: 'Asistencias', valor: totalAsistencias },
          { etiqueta: 'Faltas', valor: totalFaltas },
          { etiqueta: 'Tasa Asistencia', valor: tasaAsistencia }
        ],
        columnas: ['Fecha', 'Materia', 'Profesor', 'Presentes', 'Ausentes'],
        datos: datos.sort((a, b) => new Date(a[0]) - new Date(b[0])) // Ordenar por fecha
      });

    } catch (error) {
      next(error);
    }
  }
  
  // Aquí puedes seguir el mismo patrón para implementar:
  // async generarReporteUsoLaboratorios(req, res, next) { ... }
  // async generarReporteProfesor(req, res, next) { ... }
}

module.exports = new ReporteController();