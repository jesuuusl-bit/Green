import express from "express";
import http from "http";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import taskRoutes from "./routes/taskRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import "./models/User.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// ✅ Configuración CORS flexible
const allowedOrigins = ["http://localhost:5173"];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (
    allowedOrigins.includes(origin) ||
    (origin && origin.includes("vercel.app"))
  ) {
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

// Evitar error preflight
app.options("*", (req, res) => res.sendStatus(200));

app.use(express.json());
app.use(cors());

// 🧠 Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB conectado en backend-api"))  .catch((err) => console.error("❌ Error MongoDB:", err));

// 🧭 Rutas principales
app.use("/api/tasks", taskRoutes);
app.use("/api/projects", projectRoutes);

const PORT = process.env.PORT || 4000;
server.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 API corriendo en puerto ${PORT}`)
);
