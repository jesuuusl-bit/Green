import express from "express";
import { register, login, me } from "../controllers/authController.js";
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Rutas de autenticación
router.post("/register", verifyToken, verifyAdmin, register);
router.post("/login", login);
router.get("/me", verifyToken, me);

export default router;
