import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ msg: "No token, autorización denegada" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // ✅ guarda el usuario decodificado en la request
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token no válido" });
  }
};

export const verifyAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id); // ✅ ahora req.user.id existe
    if (user.role !== "admin") return res.status(403).json({ msg: "Acceso denegado" });
    next();
  } catch (err) {
    res.status(500).json({ msg: "Error en el servidor" });
  }
};
