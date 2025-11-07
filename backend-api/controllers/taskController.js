import Task from "../models/Task.js";

export const createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error al crear la tarea" });
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignedTo project", "name title email");
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error al obtener las tareas" });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate("assignedTo project", "name title email");
    if (!task) return res.status(404).json({ msg: "Tarea no encontrada" });
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error al obtener la tarea" });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error al actualizar la tarea" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ msg: "Tarea eliminada" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error al eliminar la tarea" });
  }
};
