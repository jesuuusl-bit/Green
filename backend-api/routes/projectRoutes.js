import express from "express";
import Project from "../models/Project.js";
import Task from "../models/Task.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

export default (io) => {
  const router = express.Router();

  // 🟢 Obtener todos los proyectos
  router.get("/", verifyToken, async (req, res) => {
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
  router.post("/", verifyToken, isAdmin, async (req, res) => {
    try {
      const { name } = req.body;
      if (!name)
        return res.status(400).json({ error: "El nombre del proyecto es obligatorio" });

      const project = new Project({
        name,
        createdBy: req.user.id,
      });

      const saved = await project.save();

      // Emitir evento al crear un nuevo proyecto
      io.emit("nuevoProyecto", saved);
      res.status(201).json(saved);
    } catch (error) {
      console.error("❌ Error al crear proyecto:", error);
      res.status(500).json({ error: "Error al crear proyecto" });
    }
  });

  // 🟢 Crear una nueva tarea dentro de un proyecto
  router.post("/:id/tasks", verifyToken, isAdmin, async (req, res) => {
    try {
      const { titulo, descripcion, asignadoA } = req.body;

      if (!titulo || !asignadoA)
        return res.status(400).json({ error: "Título y usuario asignado son obligatorios" });

      const project = await Project.findById(req.params.id);
      if (!project)
        return res.status(404).json({ error: "Proyecto no encontrado" });

      const newTask = new Task({
        titulo,
        descripcion,
        asignadoA,
        projectId: project._id,
      });

      const savedTask = await newTask.save();

      // Agregar la tarea al proyecto
      project.tasks.push(savedTask._id);
      await project.save();

      io.emit("nuevaTarea", { projectId: project._id, task: savedTask });
      res.status(201).json(savedTask);
    } catch (error) {
      console.error("❌ Error al crear tarea:", error);
      res.status(500).json({ error: "Error al crear tarea" });
    }
  });

  // 🟢 Obtener un proyecto por ID
  router.get("/:id", verifyToken, async (req, res) => {
    try {
      const project = await Project.findById(req.params.id)
        .populate("createdBy", "name email")
        .populate("tasks");
      if (!project) return res.status(404).json({ error: "Proyecto no encontrado" });
      res.json(project);
    } catch (error) {
      console.error("❌ Error al obtener proyecto:", error);
      res.status(500).json({ error: "Error al obtener proyecto" });
    }
  });

  // 🟢 Eliminar proyecto (solo admin)
  router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
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
