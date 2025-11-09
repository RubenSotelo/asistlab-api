// src/services/registroAsistencia.service.js
const { RegistroAsistencia } = require("../models");

class RegistroAsistenciaService {
  async listar() {
    // ✅ solo devuelve el modelo base
    return await RegistroAsistencia.findAll();
  }

  async seleccionar(id) {
    return await RegistroAsistencia.findByPk(id);
  }

  async crear(data) {
    return await RegistroAsistencia.create(data);
  }

  async editar(id, data) {
    const registro = await RegistroAsistencia.findByPk(id);
    if (!registro) return null;
    return await registro.update(data);
  }

  async eliminar(id) {
    const registro = await RegistroAsistencia.findByPk(id);
    if (!registro) return null;
    await registro.destroy();
    return registro;
  }
  
  // ✅ --- INICIO DE NUEVO MÉTODO ---
  /**
   * Actualiza el estado de un registro por parte del profesor.
   * (p.ej. 'Ausente' -> 'Justificado')
   */
  async actualizarEstado(id, estado) {
    const registro = await RegistroAsistencia.findByPk(id);
    if (!registro) {
      throw new Error("Registro no encontrado");
    }

    // El frontend envía 'Presente', 'Ausente', 'Justificado'
    // Tu DB (por ahora) solo tiene 'presente' (boolean).
    // Implementamos la lógica para 'Justificado' (futuro)
    // Por ahora, solo manejamos 'presente'
    
    let presente = false;
    if (estado === 'Presente') {
      presente = true;
    }
    // NOTA: Si añades un campo 'estado' (varchar) a tu DB,
    // puedes guardar "Justificado" directamente.
    // Por ahora, "Justificado" se tratará como "Ausente" (presente: false)
    
    return await registro.update({ presente });
  }
  // ✅ --- FIN DE NUEVO MÉTODO ---
}

module.exports = new RegistroAsistenciaService();