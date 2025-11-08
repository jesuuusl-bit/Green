import express from "express";
import Project from "../models/Project.js";
import Task from "../models/Task.js";

const router = express.Router();

export default (io) => {
  // Crear un nuevo proyecto (solo admin)
  router.post("/", async (req, res) => {
    try {
      const { name, description, createdBy } = req.body;
      const project = await Project.create({ name, description, createdBy });

      io.emit("nuevoProyecto", project);
      res.status(201).json(project);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al crear el proyecto" });
    }
  });

  // Obtener todos los proyectos
  router.get("/", async (req, res) => {
    try {
      const projects = await Project.find().populate("tasks");
      res.json(projects);
    } catch (err) {
      res.status(500).json({ error: "Error al obtener los proyectos" });
    }
  });

  return router;
};
