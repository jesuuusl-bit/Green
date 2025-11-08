import express from "express";
import Task from "../models/Task.js";
import Project from "../models/Project.js";

const router = express.Router();

export default (io) => {
  // Crear tarea dentro de un proyecto
  router.post("/", async (req, res) => {
    try {
      const { title, description, projectId, assignedTo } = req.body;

      const task = await Task.create({
        title,
        description,
        project: projectId,
        assignedTo,
      });

      // Asociar tarea al proyecto
      await Project.findByIdAndUpdate(projectId, { $push: { tasks: task._id } });

      io.emit("nuevaTarea", task);
      res.status(201).json(task);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al crear la tarea" });
    }
  });

  // Operador marca tarea como completada
  router.put("/:id/completar", async (req, res) => {
    try {
      const { evidenceUrl } = req.body;
      const task = await Task.findByIdAndUpdate(
        req.params.id,
        {
          status: "completada",
          evidenceUrl,
          completedAt: new Date(),
        },
        { new: true }
      );

      io.emit("tareaCompletada", task);
      res.json(task);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al completar la tarea" });
    }
  });

  // Obtener todas las tareas
  router.get("/", async (req, res) => {
    try {
      const tasks = await Task.find().populate("project assignedTo");
      res.json(tasks);
    } catch (err) {
      res.status(500).json({ error: "Error al obtener las tareas" });
    }
  });

  return router;
};
