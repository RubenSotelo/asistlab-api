const { Usuario, Tipo } = require("../models");
const env = require("../config/env");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class UsuarioService {
  async listar() {
    return await Usuario.findAll({ include: [{ model: Tipo, as: "tipo" }] });
  }

  async seleccionar(id) {
    return await Usuario.findByPk(id, { include: [{ model: Tipo, as: "tipo" }] });
  }

  // ✅ Crear usuario con contraseña encriptada
  async crear(data) {
    // Verificar que tenga password
    if (!data.password) {
      throw new Error("PASSWORD_REQUIRED");
    }

    // Encriptar la contraseña antes de guardar
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    // Reemplazar la contraseña original
    data.password = hashedPassword;

    // Crear usuario
    return await Usuario.create(data);
  }

  // ✅ Editar usuario (si cambia la contraseña, la vuelve a encriptar)
  async editar(id, data) {
    console.log("Datos: ",data);
    
    const usuario = await Usuario.findByPk(id);
    if (!usuario) return null;

    // Si se envía una nueva contraseña, se vuelve a hashear
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    }

    return await usuario.update(data);
  }

  async eliminar(id) {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) return null;
    await usuario.destroy();
    return usuario;
  }

  // ✅ Login con verificación de contraseña y control de sesión
  async login(email, password) {
    const usuario = await Usuario.findOne({
      where: { email },
      include: [{ model: Tipo, as: "tipo" }],
    });

    if (!usuario) return null;

    const isValid = await bcrypt.compare(password, usuario.password);
    if (!isValid) return null;

    if (usuario.sesion_activa)
      throw new Error("La sesión ya está iniciada en otro navegador.");

    usuario.sesion_activa = true;
    await usuario.save();

    const token = jwt.sign(
      { id: usuario.id, tipo: usuario.tipo_id },
      env.app.secret_key,
      { expiresIn: "8h" }
    );

    return { usuario, token };
  }

  // ✅ Logout
  async logout(id) {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) return null;

    usuario.sesion_activa = false;
    await usuario.save();
    return true;
  }
}

module.exports = new UsuarioService();
