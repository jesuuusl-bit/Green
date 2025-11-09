import express from "express";
import Task from "../models/Task.js";
import Project from "../models/Project.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔹 Crear tarea dentro de un proyecto (solo admin)
router.post("/", verifyToken, async (req, res) => {
  try {
    const { titulo, descripcion, projectId } = req.body;

    if (!titulo || !projectId)
      return res.status(400).json({ message: "Faltan campos obligatorios" });

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Proyecto no encontrado" });

    const newTask = new Task({ titulo, descripcion, projectId });
    await newTask.save();

    // 🔗 Añadimos referencia al proyecto
    project.tareas.push(newTask._id);
    await project.save();

    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ message: "Error al crear tarea", error: err.message });
  }
});

// 🔹 Obtener todas las tareas de un proyecto
router.get("/:projectId", verifyToken, async (req, res) => {
  try {
    const tasks = await Task.find({ projectId: req.params.projectId });
    res.json(tasks);
  } catch {
    res.status(500).json({ message: "Error al obtener tareas" });
  }
});

export default (io) => router;
