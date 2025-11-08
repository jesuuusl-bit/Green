import Task from "../models/Task.js";

export const createTask = (io) => async (req, res) => {
  try {
    const task = new Task({
      project: req.body.projectId,
      title: req.body.title,
      description: req.body.description,
      assignedTo: req.body.assignedTo,
    });
    await task.save();

    io.emit("taskCreated", task); // 🔔 notificación en tiempo real
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: "Error al crear tarea" });
  }
};

export const completeTask = (io) => async (req, res) => {
  try {
    const { id } = req.params;
    const { evidenceUrl } = req.body;

    const task = await Task.findByIdAndUpdate(
      id,
      {
        status: "completada",
        evidenceUrl,
        completedAt: new Date(),
      },
      { new: true }
    );

    if (!task) return res.status(404).json({ message: "Tarea no encontrada" });

    io.emit("taskCompleted", task); // 🔔 notificación al admin
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Error al completar tarea" });
  }
};
