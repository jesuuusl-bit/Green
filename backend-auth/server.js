import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config();
const app = express();
connectDB();

// 🧠 Configuración de CORS
const allowedOrigins = [
  "https://green-psi-dusky.vercel.app", // frontend en vercel
  "http://localhost:5173",               // para desarrollo local
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// Esto evita que el preflight falle
app.options("*", cors());

app.use(express.json());

// Rutas
import authRoutes from "./routes/auth.js";
app.use("/api/auth", authRoutes);

//puertos
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`Auth service running on ${PORT}`));
