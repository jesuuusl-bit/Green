import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import taskRoutes from "./routes/taskRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import evidenceRoutes from "./routes/evidenceRoutes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// 🔧 Configuración correcta de CORS
const allowedOrigins = [
  "http://localhost:5173",
  "https://green-psi-dusky.vercel.app", // Frontend en Vercel
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use("/api/evidencias", evidenceRoutes);

// ✅ Asegurar preflight responses para CORS
app.options("*", cors());

// 🧠 JSON parser
app.use(express.json());

// 🔌 Configuración de Socket.io con CORS igual
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});

// 🧩 Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB conectado en backend-api"))
  .catch((err) => console.error("❌ Error MongoDB:", err));

// 🧭 Rutas
app.use("/api/tasks", taskRoutes(io));
app.use("/api/projects", projectRoutes(io));

// 🌐 Endpoint base
app.get("/", (req, res) => {
  res.send("🟢 Green API corriendo correctamente 🚀");
});

// 🧠 Eventos de Socket.io
io.on("connection", (socket) => {
  console.log("🟢 Cliente conectado:", socket.id);
  socket.on("disconnect", () => {
    console.log("🔴 Cliente desconectado:", socket.id);
  });
});

// 🚀 Iniciar servidor
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`🚀 API corriendo en puerto ${PORT}`));
