const TipoService = require("../services/tipo.service");
const {TipoDTO, TipoUpdateDTO} = require("../dtos/tipo.dto");

const TipoController = {
  async listar(req, res) {
    try {
      const data = await TipoService.listar();
      res.json(data);
    } catch (error) {
      console.error("Error al listar tipos:", error);
      res.status(500).json({ error: "Error al listar tipos" });
    }
  },

  async seleccionar(req, res) {
    try {
      const { id } = req.params;
      const tipo = await TipoService.seleccionar(id);
      if (!tipo) return res.status(404).json({ error: "No encontrado" });
      res.json(tipo);
    } catch (error) {
      console.error("Error al obtener tipo:", error);
      res.status(500).json({ error: "Error al obtener tipo" });
    }
  },

  async crear(req, res) {
    try {
      const validatedData = TipoDTO.parse(req.body);
      const nuevo = await TipoService.crear(validatedData);
      res.status(201).json(nuevo);
    } catch (error) {
      console.error("Error al crear tipo:", error);
      res.status(500).json({ error: "Error al crear tipo" });
    }
  },

  async editar(req, res) {
    try {
      const validatedData = TipoUpdateDTO.parse(req.body);
      const actualizado = await TipoService.editar(req.params.id, validatedData);
      if (!actualizado) return res.status(404).json({ error: "No encontrado" });
      res.json(actualizado);
    } catch (error) {
      console.error("Error al editar tipo:", error);
      res.status(500).json({ error: "Error al editar tipo" });
    }
  },

  async eliminar(req, res) {
    try {
      const { id } = req.params;
      const eliminado = await TipoService.eliminar(id);
      if (!eliminado) return res.status(404).json({ error: "No encontrado" });
      res.json({ message: "Tipo eliminado correctamente" });
    } catch (error) {
      console.error("Error al eliminar tipo:", error);
      res.status(500).json({ error: "Error al eliminar tipo" });
    }
  },
};

module.exports = TipoController;
