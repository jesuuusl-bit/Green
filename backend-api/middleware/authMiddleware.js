import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No autorizado, token no enviado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // guarda los datos del usuario (id, rol, etc.)
    next();
  } catch (error) {
    console.error("❌ Token inválido:", error);
    res.status(401).json({ error: "Token inválido o expirado" });
  }
};

// 🔹 Middleware opcional para verificar si es administrador
export const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res
      .status(403)
      .json({ error: "Acceso denegado. Solo administradores pueden realizar esta acción." });
  }
  next();
};
