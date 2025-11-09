import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

/**
 * ✅ Middleware principal para proteger rutas con JWT
 * Asegura que el token incluya id y role del usuario.
 */
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No autorizado, token no enviado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔹 Aseguramos que se guarden correctamente los campos del usuario
    req.user = {
      id: decoded.id || decoded._id, // soporta ambas formas
      role: decoded.role || "operator", // valor por defecto
      email: decoded.email || null,
      name: decoded.name || null,
    };

    next();
  } catch (error) {
    console.error("❌ Token inválido:", error);
    res.status(401).json({ error: "Token inválido o expirado" });
  }
};

/**
 * 🔒 Middleware para validar que el usuario sea administrador
 */
export const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res
      .status(403)
      .json({
        error: "Acceso denegado. Solo administradores pueden realizar esta acción.",
      });
  }
  next();
};
