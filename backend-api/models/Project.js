import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  createdBy: { type: String }, // operador o admin que lo crea
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Project", ProjectSchema);
