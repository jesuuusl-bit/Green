import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // operador
    status: {
      type: String,
      enum: ["pendiente", "en progreso", "completada"],
      default: "pendiente",
    },
    evidenceUrl: { type: String }, // link o ruta del archivo
    completedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
