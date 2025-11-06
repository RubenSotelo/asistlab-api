const CarreraService = require("../services/carrera.service");
const {CarreraDTO, CarreraUpdateDTO} = require("../dtos/carrera.dto");

const CarreraController = {
  async listar(req, res) {
    try {
      const data = await CarreraService.listar();
      res.json(data);
    } catch (error) {
      console.error("Error al listar carreras:", error);
      res.status(500).json({ error: "Error al listar carreras" });
    }
  },

  async seleccionar(req, res) {
    try {
      const { id } = req.params;
      const carrera = await CarreraService.seleccionar(id);
      if (!carrera) return res.status(404).json({ error: "No encontrada" });
      res.json(carrera);
    } catch (error) {
      console.error("Error al obtener carrera:", error);
      res.status(500).json({ error: "Error al obtener carrera" });
    }
  },

  async crear(req, res) {
    try {
      const validatedData = CarreraDTO.parse(req.body);
      const nueva = await CarreraService.crear(validatedData);
      res.status(201).json(nueva);
    } catch (error) {
      console.error("Error al crear carrera:", error);
      res.status(500).json({ error: "Error al crear carrera" });
    }
  },

  async editar(req, res) {
    try {
      const validatedData = CarreraUpdateDTO.parse(req.body);
      const actualizada = await CarreraService.editar(req.params.id, validatedData);
      if (!actualizada) return res.status(404).json({ error: "No encontrada" });
      res.json(actualizada);
    } catch (error) {
      console.error("Error al editar carrera:", error);
      res.status(500).json({ error: "Error al editar carrera" });
    }
  },

  async eliminar(req, res) {
    try {
      const { id } = req.params;
      const eliminada = await CarreraService.eliminar(id);
      if (!eliminada) return res.status(404).json({ error: "No encontrada" });
      res.json({ message: "Carrera eliminada correctamente" });
    } catch (error) {
      console.error("Error al eliminar carrera:", error);
      res.status(500).json({ error: "Error al eliminar carrera" });
    }
  },
};

module.exports = CarreraController;
