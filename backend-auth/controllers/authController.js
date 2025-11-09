import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES = process.env.JWT_EXPIRES || "2h";

// 🟢 Registrar nuevo usuario
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email y contraseña requeridos" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ msg: "El usuario ya existe" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    // Rol por defecto: operador
    const userRole = role === "admin" ? "admin" : "operator";

    const user = new User({
      name,
      email,
      password: hashed,
      role: userRole,
    });
    await user.save();

    // 🔐 Generar token con rol incluido
    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
    });
  } catch (err) {
    console.error("❌ Error en register:", err);
    res.status(500).send("Error en el servidor");
  }
};

// 🟢 Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ msg: "Email y contraseña requeridos" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ msg: "Credenciales inválidas" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ msg: "Credenciales inválidas" });

    // 🔐 Incluir el rol en el token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
    });
  } catch (err) {
    console.error("❌ Error en login:", err);
    res.status(500).send("Error en el servidor");
  }
};

// 🟢 Obtener perfil del usuario autenticado
export const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error("❌ Error en /me:", err);
    res.status(500).send("Error en el servidor");
  }
};
