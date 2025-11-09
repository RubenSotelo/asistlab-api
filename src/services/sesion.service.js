// src/services/sesion.service.js
const { 
  Sesion, Laboratorio, Usuario, Grupo, Materia, 
  AlumnoGrupo, Alumno, RegistroAsistencia 
} = require("../models");
const { Op } = require("sequelize");

class SesionService {
  //  Listar todas las sesiones
  async listar() {
    // Incluimos solo Laboratorio (misma DB)
    const sesiones = await Sesion.findAll({
      raw: true,
      nest: true
    });

    //   Enriquecer datos de otras bases (manual)
    const sesionesConDatos = await Promise.all(
      sesiones.map(async (sesion) => {
        const laboratorio = await Laboratorio.findByPk(sesion.laboratorio_id);
        const profesor = await Usuario.findByPk(sesion.profesor_id);
        const grupo = await Grupo.findByPk(sesion.grupo_id);
        const materia = await Materia.findByPk(sesion.materia_id);

        return {
          ...sesion,
          laboratorio: laboratorio ? laboratorio.nombre : null,
          profesor: profesor ? profesor.nombre : null,
          grupo: grupo ? grupo.nombre : null,
          materia: materia ? materia.nombre : null
        };
      })
    );

    return sesionesConDatos;
  }

  // 📌 Obtener sesión por ID
  async seleccionar(id) {
    const sesion = await Sesion.findByPk(id, {
      include: [{ model: Laboratorio, as: "laboratorio" }],
      raw: true,
      nest: true
    });

    if (!sesion) return null;

    const profesor = await Usuario.findByPk(sesion.profesor_id);
    const grupo = await Grupo.findByPk(sesion.grupo_id);
    const materia = await Materia.findByPk(sesion.materia_id);

    return {
      ...sesion,
      profesor: profesor ? profesor.nombre : null,
      grupo: grupo ? grupo.nombre : null,
      materia: materia ? materia.nombre : null
    };
  }

  async crear(data) {
    return await Sesion.create(data);
  }

  async editar(id, data) {
    const sesion = await Sesion.findByPk(id);
    if (!sesion) return null;
    return await sesion.update(data);
  }

  async eliminar(id) {
    const sesion = await Sesion.findByPk(id);
    if (!sesion) return null;
    await sesion.destroy();
    return sesion;
  }
  
  // ✅ --- INICIO DE NUEVO MÉTODO ---
  /**
   * Obtiene la lista de asistencia detallada para una sesión.
   * Este es el query más complejo:
   * 1. (laboratoriosDb) Obtiene la Sesion para saber el grupo_id.
   * 2. (alumnosDb) Obtiene todos los AlumnoGrupo por grupo_id.
   * 3. (alumnosDb/authDb) Enriquece cada alumno con su nombre y matrícula.
   * 4. (asistenciasDb) Hace LEFT JOIN con RegistroAsistencia para ver el estado.
   */
  async getAsistenciaDetalle(sesionId) {
    // 1. Obtener la sesión
    const sesion = await Sesion.findByPk(sesionId);
    if (!sesion) {
      throw new Error("Sesión no encontrada");
    }

    // 2. Obtener todos los alumnos de ese grupo
    const alumnosEnGrupo = await AlumnoGrupo.findAll({
      where: { grupo_id: sesion.grupo_id, activo: true },
      include: [{ model: Alumno, as: 'alumno' }]
    });

    if (!alumnosEnGrupo || alumnosEnGrupo.length === 0) {
      return []; // Grupo vacío
    }

    // 3 y 4. Buscar detalles y estado de asistencia
    const detallesAsistencia = await Promise.all(
      alumnosEnGrupo.map(async (ag) => {
        const alumno = ag.alumno;
        if (!alumno) return null; // Dato corrupto

        // 3.1 Buscar nombre de usuario
        const usuario = await Usuario.findByPk(alumno.usuario_id);
        
        // 4. Buscar su registro de asistencia para ESTA sesión
        const registro = await RegistroAsistencia.findOne({
          where: {
            sesion_id: sesionId,
            alumno_id: alumno.id
          }
        });

        // 5. Formatear como lo espera el frontend
        let estado = 'Ausente';
        let hora = '--';
        let registroId = null;

        if (registro) {
          // El front parece manejar 'Justificado' también
          // (Tu DTO tiene 'presente' boolean. Asumimos lógica simple por ahora)
          estado = registro.presente ? 'Presente' : 'Ausente'; 
          hora = registro.hora_llegada || (registro.presente ? '??' : '--');
          registroId = registro.id;
        }

        return {
          id: registroId, // ID del *registro de asistencia* (o null)
          alumno_id: alumno.id,
          matricula: alumno.matricula,
          nombre: usuario ? usuario.nombre : 'Usuario no encontrado',
          estado: estado,
          hora: hora
        };
      })
    );
    
    // Filtrar nulos y ordenar por nombre
    return detallesAsistencia
      .filter(Boolean)
      .sort((a, b) => a.nombre.localeCompare(b.nombre));
  }
  // ✅ --- FIN DE NUEVO MÉTODO ---
}

module.exports = new SesionService();