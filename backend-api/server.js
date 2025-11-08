import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
import taskRoutes from "./routes/taskRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// 🌍 CORS manual (igual que en backend-auth)
const allowedOrigins = [
  "https://green-hwvzkw401-jesuuusl-bits-projects.vercel.app",
  "https://green-psi-dusky.vercel.app",
  "http://localhost:5173",
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  next();
});

app.options("*", (req, res) => res.sendStatus(200));

// 🧠 Conexión MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB conectado en backend-api"))
  .catch((err) => console.error("❌ Error MongoDB:", err));

// 🧩 Middleware
app.use(express.json());

// 🧠 Configurar Socket.IO
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// 📡 Rutas
app.use("/api/tasks", taskRoutes(io));
app.use("/api/projects", projectRoutes(io));

// 🔌 Eventos Socket.IO
io.on("connection", (socket) => {
  console.log("🟢 Cliente conectado:", socket.id);
  socket.on("disconnect", () => console.log("🔴 Cliente desconectado:", socket.id));
});

// 🚀 Server
const PORT = process.env.PORT || 4000;
server.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 backend-api corriendo en puerto ${PORT}`)
);
