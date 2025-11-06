const { Laboratorio, Sesion, Alumno, RegistroAsistencia, Grupo, AlumnoGrupo } = require('../models');

const databaseHelpers = {
  registrarAsistenciaAutomatica: async (qrCode, matricula) => {
    try {
      // Buscar laboratorio por QR
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

      // Verificar si hay sesión activa
      if (!laboratorio.sesion_activa_id) {
        return {
          success: false,
          error: 'NO_SESION_ACTIVA',
          message: 'No hay sesión activa en este laboratorio'
        };
      }

      // Obtener la sesión activa
      const sesion = await Sesion.findByPk(laboratorio.sesion_activa_id, {
        include: [Grupo]
      });

      if (!sesion || sesion.estado !== 'activa') {
        return {
          success: false,
          error: 'SESION_INACTIVA',
          message: 'La sesión ya no está activa'
        };
      }

      // Buscar alumno por matrícula que pertenezca al grupo de la sesión
      const alumno = await Alumno.findOne({
        where: { matricula },
        include: [{
          model: AlumnoGrupo,
          where: { 
            grupo_id: sesion.grupo_id,
            activo: true
          }
        }]
      });

      if (!alumno) {
        return {
          success: false,
          error: 'ALUMNO_NO_ENCONTRADO',
          message: 'Matrícula no encontrada o no pertenece al grupo de esta sesión'
        };
      }

      // Verificar si ya está registrado
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

      // Registrar asistencia
      const registro = await RegistroAsistencia.create({
        sesion_id: sesion.id,
        alumno_id: alumno.id,
        laboratorio_id: laboratorio.id,
        presente: true,
        metodo_registro: 'qr',
        hora_registro: new Date().toTimeString().split(' ')[0]
      });

      return {
        success: true,
        message: 'Asistencia registrada correctamente',
        data: {
          alumno: {
            matricula: alumno.matricula,
            nombre: alumno.nombre
          },
          sesion: {
            actividad: sesion.actividad,
            laboratorio: laboratorio.nombre
          },
          registro: {
            hora: registro.hora_registro,
            fecha: new Date().toLocaleDateString()
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        error: 'ERROR_INTERNO',
        message: 'Error interno del servidor'
      };
    }
  }
};

module.exports = databaseHelpers;