import express from "express";
import Task from "../models/Task.js";
import Project from "../models/Project.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Crear tarea (solo admin)
router.post("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const { titulo, descripcion, projectId } = req.body;

    if (!titulo || !projectId)
      return res.status(400).json({ message: "Faltan campos obligatorios" });

    const project = await Project.findById(projectId);
    if (!project)
      return res.status(404).json({ message: "Proyecto no encontrado" });

    const newTask = new Task({ titulo, descripcion, projectId });
    await newTask.save();

    project.tareas.push(newTask._id);
    await project.save();

    res.status(201).json(newTask);
  } catch (err) {
    console.error("Error al crear tarea:", err);
    res.status(500).json({ message: "Error al crear tarea" });
  }
});

// Marcar tarea como completada (operador)
router.put("/:id/complete", verifyToken, async (req, res) => {
  try {
    const { evidencia } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Tarea no encontrada" });

    task.completada = true;
    task.evidencia = evidencia || "Sin evidencia adjunta";
    task.completadaPor = req.user.id;

    await task.save();
    res.json(task);
  } catch (err) {
    console.error("Error al completar tarea:", err);
    res.status(500).json({ message: "Error al completar tarea" });
  }
});

export default router;
