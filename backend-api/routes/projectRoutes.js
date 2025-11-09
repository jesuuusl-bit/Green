import express from "express";
import Project from "../models/Project.js";
import Task from "../models/Task.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Obtener todos los proyectos (con tareas)
router.get("/", verifyToken, async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("createdBy", "name email")
      .populate("tareas");
    res.json(projects);
  } catch (error) {
    console.error("Error al obtener proyectos:", error);
    res.status(500).json({ error: "Error al obtener proyectos" });
  }
});

// Crear nuevo proyecto
router.post("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Nombre requerido" });

    const project = new Project({
      name,
      createdBy: req.user.id,
    });
    await project.save();

    res.status(201).json(project);
  } catch (error) {
    console.error("Error al crear proyecto:", error);
    res.status(500).json({ error: "Error al crear proyecto" });
  }
});

export default router;
