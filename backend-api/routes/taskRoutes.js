import express from "express";
import Task from "../models/Task.js";
import Project from "../models/Project.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

export default (io) => {
  const router = express.Router();

  // 🔹 Crear tarea dentro de un proyecto (solo admin)
  router.post("/", verifyToken, isAdmin, async (req, res) => {
    try {
      const { titulo, descripcion, projectId } = req.body;

      if (!titulo || !projectId) {
        return res
          .status(400)
          .json({ message: "Faltan campos obligatorios: título o projectId" });
      }

      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({ message: "Proyecto no encontrado" });
      }

      // Crear la nueva tarea
      const newTask = new Task({
        titulo,
        descripcion,
        projectId,
        completada: false,
        fechaCreacion: new Date(),
      });

      const savedTask = await newTask.save();

      // Agregar referencia en el proyecto
      if (!project.tareas) project.tareas = [];
      project.tareas.push(savedTask._id);
      await project.save();

      // Emitir evento de tarea nueva a todos los sockets conectados
      io.emit("nuevaTarea", {
        projectId,
        titulo: savedTask.titulo,
        descripcion: savedTask.descripcion,
      });

      res.status(201).json(savedTask);
    } catch (err) {
      console.error("❌ Error al crear tarea:", err);
      res.status(500).json({
        message: "Error interno al crear la tarea",
        error: err.message,
      });
    }
  });

  // 🔹 Obtener todas las tareas de un proyecto
  router.get("/:projectId", verifyToken, async (req, res) => {
    try {
      const tasks = await Task.find({ projectId: req.params.projectId });
      res.json(tasks);
    } catch (error) {
      console.error("❌ Error al obtener tareas:", error);
      res.status(500).json({ message: "Error al obtener tareas" });
    }
  });

  return router;
};
