import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const allowedOrigins = [
  "http://localhost:5173", // para desarrollo local
  "https://green-psi-dusky.vercel.app", // tu frontend en producción
];

const app = express();
connectDB();

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.use(express.json());

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`Auth service running on ${PORT}`));
