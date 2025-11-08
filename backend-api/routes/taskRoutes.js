import express from "express";
import Task from "../models/Task.js";
import Project from "../models/Project.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

export default (io) => {
  const router = express.Router();

  // 🟢 Obtener tareas de un proyecto
  router.get("/:projectId", protect, async (req, res) => {
    try {
      const tasks = await Task.find({ projectId: req.params.projectId })
        .populate("createdBy", "name")
        .populate("completedBy", "name");
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener tareas" });
    }
  });

  // 🟢 Crear nueva tarea (solo admin)
  router.post("/", protect, isAdmin, async (req, res) => {
    try {
      const { title, projectId, description } = req.body;
      if (!title || !projectId)
        return res.status(400).json({ error: "Título y proyecto son requeridos" });

      const task = new Task({
        title,
        description,
        projectId,
        createdBy: req.user.id,
      });

      const saved = await task.save();

      // Agregar la tarea al proyecto
      await Project.findByIdAndUpdate(projectId, {
        $push: { tasks: saved._id },
      });

      io.emit("nuevaTarea", saved);
      res.status(201).json(saved);
    } catch (error) {
      console.error("❌ Error al crear tarea:", error);
      res.status(500).json({ error: "Error al crear tarea" });
    }
  });

  // 🟢 Marcar tarea como completada
  router.put("/:id/complete", protect, async (req, res) => {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) return res.status(404).json({ error: "Tarea no encontrada" });

      task.status = "completada";
      task.completedBy = req.user.id;
      task.evidence = req.body.evidence;
      await task.save();

      io.emit("tareaCompletada", {
        tarea: task.title,
        operator: req.user.name || "Operador",
      });

      res.json({ message: "Tarea completada con éxito" });
    } catch (error) {
      console.error("❌ Error al completar tarea:", error);
      res.status(500).json({ error: "Error al completar tarea" });
    }
  });

  return router;
};
