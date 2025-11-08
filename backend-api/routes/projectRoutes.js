import express from "express";
import Project from "../models/Project.js";
import Task from "../models/Task.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

export default (io) => {
  const router = express.Router();

  // 🟢 Obtener todos los proyectos
  router.get("/", protect, async (req, res) => {
    try {
      const projects = await Project.find()
        .populate("createdBy", "name email")
        .populate("tasks");
      res.json(projects);
    } catch (error) {
      console.error("❌ Error al obtener proyectos:", error);
      res.status(500).json({ error: "Error al obtener proyectos" });
    }
  });

  // 🟢 Crear nuevo proyecto (solo admin)
  router.post("/", protect, isAdmin, async (req, res) => {
    try {
      const { name } = req.body;
      if (!name)
        return res.status(400).json({ error: "El nombre del proyecto es obligatorio" });

      const project = new Project({
        name,
        createdBy: req.user.id,
      });

      const saved = await project.save();
      io.emit("nuevoProyecto", saved);
      res.status(201).json(saved);
    } catch (error) {
      console.error("❌ Error al crear proyecto:", error);
      res.status(500).json({ error: "Error al crear proyecto" });
    }
  });

  // 🟢 Obtener un proyecto por ID
  router.get("/:id", protect, async (req, res) => {
    try {
      const project = await Project.findById(req.params.id)
        .populate("createdBy", "name email")
        .populate("tasks");
      if (!project) return res.status(404).json({ error: "Proyecto no encontrado" });
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener proyecto" });
    }
  });

  // 🟢 Eliminar proyecto (solo admin)
  router.delete("/:id", protect, isAdmin, async (req, res) => {
    try {
      await Task.deleteMany({ projectId: req.params.id });
      await Project.findByIdAndDelete(req.params.id);
      res.json({ message: "Proyecto eliminado con sus tareas asociadas" });
    } catch (error) {
      console.error("❌ Error al eliminar proyecto:", error);
      res.status(500).json({ error: "Error al eliminar proyecto" });
    }
  });

  return router;
};
