import React, { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Llamada normal de login
      await login(email, password);

      const token = localStorage.getItem("token");
      const user = JSON.parse(atob(token.split(".")[1]));

      // 🔌 Conectar Socket.IO al backend-API (Render)
      const socket = io("https://green-l5n5.onrender.com", {
        auth: { token },
      });

      socket.on("connect", () => {
        console.log("🟢 Conectado al servidor Socket:", socket.id);
      });

      // Eventos de tiempo real
      socket.on("projectCreated", (project) => {
        console.log("📢 Nuevo proyecto:", project);
      });

      socket.on("taskCreated", (task) => {
        console.log("📝 Nueva tarea:", task);
      });

      socket.on("taskUpdated", (task) => {
        console.log("♻️ Tarea actualizada:", task);
      });

      // Guardar socket en window o contexto global si quieres usarlo luego
      window.socket = socket;

      // Redirigir según rol
      if (user.role === "admin") nav("/admin");
      else nav("/operator");

    } catch (err) {
      console.error("❌ Error al iniciar sesión:", err);
      alert("Error de login. Verifica tus credenciales.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: "24rem" }}>
        <h3 className="text-center mb-4 text-success">Iniciar Sesión</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Correo</label>
            <input
              type="email"
              className="form-control"
              placeholder="admin@greentech.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-success w-100">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
