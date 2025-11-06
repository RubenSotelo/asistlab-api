// controllers/usuario.controller.js
const UsuarioService = require("../services/usuario.service");
const { UsuarioDTO, UsuarioUpdateDTO } = require("../dtos/usuario.dto");
const LoginDTO = require("../dtos/login.dto");

const UsuarioController = {
  // ✅ Login usando UsuarioService directamente
  async login(req, res) {
    try {
      const validatedData = LoginDTO.parse(req.body);
      const { email, password } = validatedData;

      const result = await UsuarioService.login(email, password);

      if (!result || !result.usuario) {
        return res.status(401).json({
          error: "Correo o contraseña incorrectos",
          code: "INVALID_CREDENTIALS",
        });
      }

      res.json({
        success: true,
        usuario: result.usuario,
        token: result.token,
        message: "Login exitoso",
      });
    } catch (error) {
      console.log(error);
      if (error.name === "ZodError") {
        return res.status(400).json({
          error: "Datos de entrada inválidos",
          detalles: error.errors,
        });
      }

      if (error.message === "La sesión ya está iniciada en otro navegador.") {
        return res.status(409).json({
          error: error.message,
          code: "SESSION_ACTIVE",
        });
      }

      res.status(500).json({
        error: "Error interno del servidor",
        code: "INTERNAL_ERROR",
      });
      
    }
  },

  // ✅ Cerrar sesión
  async logout(req, res) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          error: "ID de usuario inválido",
          code: "INVALID_USER_ID",
        });
      }

      const result = await UsuarioService.logout(id);

      if (!result) {
        return res.status(404).json({
          error: "Usuario no encontrado",
          code: "USER_NOT_FOUND",
        });
      }

      res.json({
        success: true,
        message: "Sesión cerrada correctamente",
      });
    } catch (error) {
      res.status(500).json({
        error: "Error al cerrar sesión",
        code: "LOGOUT_ERROR",
      });
    }
  },

  // ✅ Crear usuario
  async crear(req, res) {
    try {
      const data = UsuarioDTO.parse(req.body);
      const usuario = await UsuarioService.crear(data);

      res.status(201).json({
        success: true,
        usuario,
        message: "Usuario creado exitosamente",
      });
    } catch (error) {
      if (error.name === "ZodError" && Array.isArray(error.errors)) {
        return res.status(400).json({
          error: "Datos de entrada inválidos",
          detalles: error.errors.map((err) => ({
            campo: err.path?.[0],
            mensaje: err.message,
          })),
        });
      }

      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(409).json({
          error: "El email ya está registrado",
          code: "EMAIL_EXISTS",
        });
      }

      if (error.name === "SequelizeForeignKeyConstraintError") {
        return res.status(400).json({
          error: "El tipo de usuario especificado no existe",
          code: "INVALID_USER_TYPE",
        });
      }

      res.status(500).json({
        error: "Error al crear el usuario",
        code: "CREATE_USER_ERROR",
      });
      console.log(error);
      
    }
  },

  // ✅ Listar todos
  async listar(req, res) {
    try {
      const usuarios = await UsuarioService.listar();
      res.json(usuarios);
    } catch (error) {
      res.status(500).json({
        error: "Error al obtener los usuarios",
        code: "LIST_USERS_ERROR",
      });
    }
  },

  // ✅ Seleccionar por ID
  async seleccionar(req, res) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          error: "ID de usuario inválido",
          code: "INVALID_USER_ID",
        });
      }

      const usuario = await UsuarioService.seleccionar(id);

      if (!usuario) {
        return res.status(404).json({
          error: "Usuario no encontrado",
          code: "USER_NOT_FOUND",
        });
      }

      res.json({
        success: true,
        data: usuario,
      });
    } catch (error) {
      res.status(500).json({
        error: "Error al obtener el usuario",
        code: "GET_USER_ERROR",
      });
    }
  },

  // ✅ Editar usuario
  async editar(req, res) {
    try {
      console.log(req.body);
      
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          error: "ID de usuario inválido",
          code: "INVALID_USER_ID",
        });
      }

      const data = UsuarioUpdateDTO.parse(req.body);
      const usuario = await UsuarioService.editar(id, data);

      if (!usuario) {
        return res.status(404).json({
          error: "Usuario no encontrado",
          code: "USER_NOT_FOUND",
        });
      }

      res.json({
        success: true,
        usuario,
        message: "Usuario actualizado exitosamente",
      });
    } catch (error) {
      if (error.name === "ZodError") {
        return res.status(400).json({
          error: "Datos de entrada inválidos",
          detalles: error.errors,
        });
      }

      res.status(500).json({
        error: "Error al actualizar el usuario",
        code: "UPDATE_USER_ERROR",
      });
    }
  },

  // ✅ Eliminar usuario
  async eliminar(req, res) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          error: "ID de usuario inválido",
          code: "INVALID_USER_ID",
        });
      }

      const usuario = await UsuarioService.eliminar(id);
      if (!usuario) {
        return res.status(404).json({
          error: "Usuario no encontrado",
          code: "USER_NOT_FOUND",
        });
      }

      res.json({
        success: true,
        message: "Usuario eliminado correctamente",
      });
    } catch (error) {
      res.status(500).json({
        error: "Error al eliminar el usuario",
        code: "DELETE_USER_ERROR",
      });
    }
  },
};

module.exports = UsuarioController;
