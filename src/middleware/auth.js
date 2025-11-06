// middleware/auth.js
const jwt = require('jsonwebtoken');
const { Usuario, Alumno } = require('../models');
const env = require('../config/env')
const auth = {
  // Verificar token JWT
  verifyToken: async (req, res, next) => {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
      }
      const decoded = jwt.verify(token, env.app.secret_key);
      // Verificar que el usuario aún existe en la base de datos
      const usuario = await Usuario.findByPk(decoded.id);
      if (!usuario) 
        return res.status(401).json({ error: 'Token inválido. Usuario no encontrado.' });

      if (usuario.sesion_activa &&  usuario.registro_completo) 
        return res.status(401).json({ error: "Sesión iniciada en otro dispositivo" });

      req.user = usuario;
      next();
    } catch (error) {      
      res.status(401).json({ error: 'Token inválido.' });
    }
  },
  // Verificar si es administrador
  isAdmin: (req, res, next) => {
    if (req.user.tipo_id !== 1)  {
      return res.status(403).json({ error: 'Acceso denegado. Se requieren permisos de administrador.' });
    }
    next();
  },
};

module.exports = auth;