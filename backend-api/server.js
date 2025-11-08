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
];import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
import taskRoutes from "./routes/taskRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// 🌍 CORS manual (mismo estilo que backend-auth)
const allowedOrigins = [
  "https://green-hwvzkw401-jesuuusl-bits-projects.vercel.app", // dominio actual vercel
  "https://green-psi-dusky.vercel.app", // dominio anterior
  "http://localhost:5173", // desarrollo local
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

// ⚙️ Manejar preflight
app.options("*", (req, res) => {
  res.sendStatus(200);
});

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

// 🧠 Configurar Socket.IO con mismo CORS
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// 📡 Rutas con socket inyectado
app.use("/api/tasks", taskRoutes(io));
app.use("/api/projects", projectRoutes(io));

// 🔌 Eventos Socket.IO
io.on("connection", (socket) => {
  console.log("🟢 Cliente conectado:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Cliente desconectado:", socket.id);
  });
});

// 🚀 Server
const PORT = process.env.PORT || 4000;
server.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 backend-api corriendo en puerto ${PORT}`)
);


app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
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
