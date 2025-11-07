import express from "express";
import Project from "../models/Project.js";

const router = express.Router();

export default function (io) {
  // Crear un proyecto
  router.post("/", async (req, res) => {
    try {
      const { name, description, createdBy } = req.body;
      const project = new Project({ name, description, createdBy });
      await project.save();

      // 🔔 Notificar a todos los clientes conectados
      io.emit("nuevoProyecto", {
        name,
        description,
        createdBy,
        createdAt: project.createdAt,
      });

      res.json({ msg: "✅ Proyecto creado correctamente", project });
    } catch (err) {
      console.error("❌ Error creando proyecto:", err);
      res.status(500).json({ msg: "Error del servidor" });
    }
  });

  // Obtener todos los proyectos
  router.get("/", async (req, res) => {
    try {
      const projects = await Project.find().sort({ createdAt: -1 });
      res.json(projects);
    } catch (err) {
      console.error("❌ Error obteniendo proyectos:", err);
      res.status(500).json({ msg: "Error del servidor" });
    }
  });

  return router;
}
