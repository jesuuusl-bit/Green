import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../contexts/SocketContext";

export default function AdminDashboard() {
  const nav = useNavigate();
  const socket = useContext(SocketContext); // 👈 usamos el socket global
  const [notificaciones, setNotificaciones] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    nav("/login");
  };

  useEffect(() => {
    if (!socket) return;

    // Escuchar cuando un operador crea una tarea o proyecto
    socket.on("nuevaTarea", (data) => {
      setNotificaciones((prev) => [
        ...prev,
        `🆕 Nueva tarea creada: ${data.title}`,
      ]);
    });

    socket.on("nuevoProyecto", (data) => {
      setNotificaciones((prev) => [
        ...prev,
        `📁 Nuevo proyecto creado: ${data.name}`,
      ]);
    });

    // Limpieza de listeners
    return () => {
      socket.off("nuevaTarea");
      socket.off("nuevoProyecto");
    };
  }, [socket]);

  return (
    <div className="d-flex vh-100">
      {/* Sidebar */}
      <div
        className="bg-success text-white p-3"
        style={{ width: "250px", minHeight: "100vh" }}
      >
        <h4 className="text-center mb-4">Panel Admin</h4>
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <button
              className="btn btn-light w-100"
              onClick={() => nav("/admin/add-user")}
            >
              ➕ Agregar Usuario
            </button>
          </li>
          <li className="nav-item mb-2">
            <button
              className="btn btn-light w-100"
              onClick={() =>
                alert("Aquí podrías ver reportes u otras funciones")
              }
            >
              📊 Ver Reportes
            </button>
          </li>
          <li className="nav-item mt-4">
            <button className="btn btn-danger w-100" onClick={handleLogout}>
              🔒 Cerrar Sesión
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-5 bg-light">
        <h2 className="text-success">Bienvenido, Administrador 👋</h2>
        <p className="lead mt-3">
          Desde este panel puedes gestionar usuarios, revisar reportes y
          supervisar las operaciones de GreenTech.
        </p>
        <hr />
        <div className="alert alert-success mt-4" role="alert">
          🌱 Sistema funcionando correctamente. Todo en orden.
        </div>

        {/* 🔔 Notificaciones en tiempo real */}
        {notificaciones.length > 0 && (
          <div className="mt-4">
            <h5>🔔 Notificaciones recientes:</h5>
            <ul className="list-group mt-2">
              {notificaciones.map((n, i) => (
                <li key={i} className="list-group-item">
                  {n}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
