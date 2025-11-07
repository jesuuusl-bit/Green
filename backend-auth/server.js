import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
//imports de rutas
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

//conexxion base de datos
connectDB();

//configuracion de CORS
const allowedOrigins = [
  "http://localhost:5173", // para desarrollo local
  "https://green-psi-dusky.vercel.app", // tu frontend en producción
];


app.use(
  cors({
    origin: function (origin, callback) {
      // Permite solicitudes sin 'origin' (como Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("No permitido por CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
//rutas
app.use("/api/auth", authRoutes);

//puertos
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`Auth service running on ${PORT}`));
