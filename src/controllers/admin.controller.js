// src/controllers/admin.controller.js
const { 
  Usuario, Alumno, Materia, Laboratorio, Sesion, Grupo 
} = require("../models");
const { Op } = require("sequelize");
const moment = require("moment-timezone"); // Para manejar fechas

/*
 * Este es un controlador nuevo para centralizar la lógica
 * que es específica del rol de Administrador.
 */
class AdminController {

  /**
   * @route GET /api/v1/admin/dashboard-data
   * Obtiene todos los datos consolidados para el dashboard del admin.
   * Esta función consulta en las 5 bases de datos.
   */
  async getDashboardData(req, res, next) {
    try {
      const today = moment().tz("America/Mexico_City").startOf('day').toDate();

      // --- 1. Obtener Estadísticas (Consultas paralelas) ---
      const [
        totalAlumnos,
        totalProfesores,
        totalMaterias,
        laboratoriosActivos,
        trendAlumnos,
        trendProfesores
      ] = await Promise.all([
        // authDb
        Usuario.count({ where: { tipo_id: 3 } }), // Asumimos que 3 es Alumno
        // authDb
        Usuario.count({ where: { tipo_id: 2 } }), // Asumimos que 2 es Profesor
        // academicaDb
        Materia.count(),
        // laboratoriosDb
        Laboratorio.count({ where: { sesion_activa_id: { [Op.not]: null } } }),
        // alumnosDb (Nuevos hoy)
        Alumno.count({ where: { created_at: { [Op.gte]: today } } }),
         // authDb (Nuevos hoy)
        Usuario.count({ where: { tipo_id: 2, created_at: { [Op.gte]: today } } })
      ]);

      // --- 2. Obtener Reservas Recientes (Últimas 5) ---
      const sesionesRecientesRaw = await Sesion.findAll({
        limit: 5,
        order: [['created_at', 'DESC']]
      });

      // 3. Enriquecer las sesiones (lógica similar a sesion.service.js)
      const reservasRecientes = await Promise.all(
        sesionesRecientesRaw.map(async (sesion) => {
          const [materia, laboratorio, profesor, grupo] = await Promise.all([
            Materia.findByPk(sesion.materia_id),
            Laboratorio.findByPk(sesion.laboratorio_id),
            Usuario.findByPk(sesion.profesor_id),
            Grupo.findByPk(sesion.grupo_id)
          ]);

          return {
            id: sesion.id,
            materia: materia ? materia.nombre : 'N/A',
            grupo: grupo ? `Grupo ${grupo.nombre}` : 'N/A',
            aula: laboratorio ? laboratorio.nombre : 'N/A',
            profesor: profesor ? profesor.nombre : 'N/A',
            fecha: sesion.fecha, // El frontend lo formatea
            estado: sesion.estado // 'activa', 'programada', 'finalizada'
          };
        })
      );

      // --- 4. Construir Respuesta ---
      const dashboardData = {
        stats: {
          totalAlumnos,
          totalProfesores,
          totalMaterias,
          laboratoriosActivos,
          trendAlumnos: `+${trendAlumnos}`, // Formato '+12'
          trendProfesores: `+${trendProfesores}` // Formato '+2'
        },
        reservasRecientes
      };

      res.json(dashboardData);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AdminController();