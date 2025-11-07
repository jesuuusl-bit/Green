import express from "express";
import Task from "../models/Task.js";

const router = express.Router();

export default function (io) {
  // Crear tarea
  router.post("/", async (req, res) => {
    try {
      const { title, description, project, createdBy } = req.body;
      const task = new Task({ title, description, project, createdBy });
      await task.save();

      // 🔴 Emitir evento a todos los conectados
      io.emit("nuevaTarea", { title, project, createdBy });

      res.json({ msg: "✅ Tarea creada correctamente", task });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "❌ Error del servidor" });
    }
  });

  // Obtener todas las tareas
  router.get("/", async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
  });

  return router;
}
