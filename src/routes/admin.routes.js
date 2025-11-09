// src/routes/admin.routes.js
const { Router } = require("express");
const adminController = require("../controllers/admin.controller");
const auth = require("../middleware/auth");

const router = Router();

// Proteger todas las rutas de este archivo
router.use(auth.verifyToken, auth.isAdmin);

/**
 * @route GET /api/v1/admin/dashboard-data
 * Obtiene los datos consolidados para el dashboard del admin
 */
router.get(
  "/dashboard-data",
  adminController.getDashboardData
);

module.exports = router;