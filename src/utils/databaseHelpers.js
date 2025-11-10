// src/utils/databaseHelpers.js
const { 
  Laboratorio, Sesion, Alumno, RegistroAsistencia, Grupo, AlumnoGrupo 
} = require('../models');
const { Op } = require("sequelize"); // ✅ Importar Op

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

      // ✅ --- INICIO DE LA CORRECCIÓN ---
      // 4. Verificar si la sesión está lista Y en la hora correcta
      
      const ahora = moment().tz("America/Mexico_City");
      const fechaHoy = ahora.format("YYYY-MM-DD");
      const horaActual = ahora.format("HH:mm:ss");

      // Comprobar que la sesión sea de hoy
      if (!sesion || sesion.fecha !== fechaHoy) {
         return {
          success: false,
          error: 'SESION_NO_ES_DE_HOY',
          message: 'La sesión activa en este laboratorio no está programada para hoy.'
        };
      }

      // Comprobar que estemos en el rango de la hora
      // (Permitimos escanear desde 15 min antes hasta 15 min después de que termine)
      const horaInicio = moment.tz(`${sesion.fecha}T${sesion.hora_inicio}`, "America/Mexico_City").subtract(15, 'minutes');
      const horaFin = moment.tz(`${sesion.fecha}T${sesion.hora_fin}`, "America/Mexico_City").add(15, 'minutes');

      if (!ahora.isBetween(horaInicio, horaFin)) {
        return {
          success: false,
          error: 'SESION_FUERA_DE_HORA',
          message: `La sesión es de ${sesion.hora_inicio} a ${sesion.hora_fin}. Aún no puedes registrarte.`
        };
      }
      
      // Comprobar que el estado sea válido
      if (sesion.estado !== 'activa' && sesion.estado !== 'programada') {
        return {
          success: false,
          error: 'SESION_INACTIVA',
          message: 'La sesión ya no está activa o ha sido finalizada.'
        };
      }
      // ✅ --- FIN DE LA CORRECCIÓN ---
      
      // 5. Obtener el grupo (consulta separada)
      const grupo = await Grupo.findByPk(sesion.grupo_id);
      if (!grupo) {
        return {
          success: false,
          error: 'GRUPO_NO_ENCONTRADO',
          message: 'Error interno: El grupo de la sesión no se encontró.'
        };
      }

      // 6. Buscar alumno por matrícula Y verificar que esté en el grupo
      const alumno = await Alumno.findOne({
        where: { matricula: matricula },
        include: [{
          model: AlumnoGrupo,
          as: 'alumno_grupos', // Usamos la relación 'alumno_grupos' de index.js
          where: { 
            grupo_id: sesion.grupo_id, 
            activo: true
          },
          required: true // <-- INNER JOIN
        }]
      });

      if (!alumno) {
        return {
          success: false,
          error: 'ALUMNO_NO_ENCONTRADO',
          message: 'Matrícula no encontrada o no perteneces al grupo de esta sesión'
        };
      }

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
        hora_llegada: horaActual // Usamos la hora que ya calculamos
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
            fecha: sesion.fecha
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