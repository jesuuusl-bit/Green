import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  project: { type: String },
  createdBy: { type: String }, // id o nombre del operador
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Task", TaskSchema);
