import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import taskRoutes from "./routes/taskRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://green-psi-dusky.vercel.app", // ✅ tu frontend en Vercel
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB conexión
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB conectado en backend-api"))
  .catch((err) => console.error("❌ Error MongoDB:", err));

// Routes
app.use("/api/tasks", taskRoutes(io));
app.use("/api/projects", projectRoutes(io));

// Socket.io conexión
io.on("connection", (socket) => {
  console.log("🟢 Cliente conectado:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Cliente desconectado:", socket.id);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`🚀 API corriendo en puerto ${PORT}`));
