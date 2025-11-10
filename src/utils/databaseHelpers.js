// src/utils/databaseHelpers.js
const { 
  Laboratorio, Sesion, Alumno, RegistroAsistencia, Grupo, AlumnoGrupo 
} = require('../models');

const databaseHelpers = {
  registrarAsistenciaAutomatica: async (qrCode, matricula) => {
    try {
      // 1. Buscar laboratorio por QR
      const laboratorio = await Laboratorio.findOne({
        where: { qr_code: qrCode, activo: true }
      });

      if (!laboratorio) {
        return {
          success: false,
          error: 'QR_INVALIDO',
          message: 'Código QR del laboratorio no válido'
        };
      }

      // 2. Verificar si hay sesión activa
      if (!laboratorio.sesion_activa_id) {
        return {
          success: false,
          error: 'NO_SESION_ACTIVA',
          message: 'No hay sesión activa en este laboratorio'
        };
      }

      // 3. Obtener la sesión activa
      const sesion = await Sesion.findByPk(laboratorio.sesion_activa_id);

      // 4. Verificar si la sesión está lista (programada O activa)
      if (!sesion || (sesion.estado !== 'activa' && sesion.estado !== 'programada')) {
        return {
          success: false,
          error: 'SESION_INACTIVA',
          message: 'La sesión ya no está activa o ha sido finalizada.'
        };
      }
      
      // 5. Obtener el grupo (consulta separada)
      const grupo = await Grupo.findByPk(sesion.grupo_id);
      if (!grupo) {
        return {
          success: false,
          error: 'GRUPO_NO_ENCONTRADO',
          message: 'Error interno: El grupo de la sesión no se encontró.'
        };
      }

      // ✅ --- INICIO DE LA CORRECCIÓN ---
      // 6. Buscar alumno por matrícula Y verificar que esté en el grupo
      const alumno = await Alumno.findOne({
        where: { matricula: matricula },
        // Usamos la relación 'alumno_grupos' que definimos en index.js
        include: [{
          model: AlumnoGrupo,
          as: 'alumno_grupos', 
          where: { 
            grupo_id: sesion.grupo_id, // El alumno debe estar en el grupo de la sesión
            activo: true
          },
          required: true // <-- IMPORTANTE: Hace que sea un INNER JOIN
        }]
      });

      // Si el Alumno no se encuentra (o no está en ese grupo), fallará aquí
      if (!alumno) {
        return {
          success: false,
          error: 'ALUMNO_NO_ENCONTRADO',
          message: 'Matrícula no encontrada o no perteneces al grupo de esta sesión'
        };
      }
      // ✅ --- FIN DE LA CORRECCIÓN ---

      // 7. Verificar si ya está registrado
      const registroExistente = await RegistroAsistencia.findOne({
        where: {
          sesion_id: sesion.id,
          alumno_id: alumno.id
        }
      });

      if (registroExistente) {
        return {
          success: false,
          error: 'YA_REGISTRADO',
          message: 'Ya tienes asistencia registrada para esta sesión'
        };
      }

      // 8. Registrar asistencia
      const registro = await RegistroAsistencia.create({
        sesion_id: sesion.id,
        alumno_id: alumno.id,
        laboratorio_id: laboratorio.id,
        presente: true,
        metodo_registro: 'qr',
        hora_llegada: new Date().toTimeString().split(' ')[0] // Hora actual
      });

      // 9. Opcional: Cambiar estado de la sesión a "activa"
      if (sesion.estado === 'programada') {
        sesion.estado = 'activa';
        await sesion.save();
      }

      return {
        success: true,
        message: 'Asistencia registrada correctamente',
        data: {
          alumno: {
            matricula: alumno.matricula
          },
          sesion: {
            actividad: sesion.actividad,
            laboratorio: laboratorio.nombre
          },
          registro: {
            hora: registro.hora_llegada,
            fecha: new Date().toLocaleDateString()
          }
        }
      };
    } catch (error) {
      console.error("Error en registrarAsistenciaAutomatica:", error);
      return {
        success: false,
        error: 'ERROR_INTERNO',
        message: 'Error interno del servidor al procesar la asistencia.'
      };
    }
  }
};

module.exports = databaseHelpers;