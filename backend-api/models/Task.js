import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: true,
      trim: true,
    },
    descripcion: {
      type: String,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    completada: {
      type: Boolean,
      default: false,
    },
    evidenciaUrl: {
      type: String, // aquí se guarda la URL de la evidencia (más adelante usaremos uploads o Cloudinary)
    },
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
