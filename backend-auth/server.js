import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";

dotenv.config();
const app = express();
connectDB();

// 🧠 CORS CONFIG (permitir todas las rutas del frontend y localhost)
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

// Manejamos OPTIONS para evitar bloqueo de preflight
app.options("*", (req, res) => {
  res.sendStatus(200);
});

app.use(express.json());
app.use("/api/auth", authRoutes);

//puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`Auth service running on ${PORT}`));
