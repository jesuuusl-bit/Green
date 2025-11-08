import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SocketContext } from "../contexts/SocketContext";

export default function ProjectDetails() {
  const { id } = useParams();
  const nav = useNavigate();
  const socket = useContext(SocketContext);

  const [project, setProject] = useState(null);
  const [nuevaTarea, setNuevaTarea] = useState("");
  const [notificaciones, setNotificaciones] = useState([]);

  useEffect(() => {
    cargarProyecto();

    if (socket) {
      socket.on("tareaCompletada", (data) => {
        if (data.projectId === id) {
          setNotificaciones((prev) => [
            ...prev,
            `✅ ${data.operator} completó: ${data.tarea}`,
          ]);
        }
      });
    }

    return () => {
      if (socket) socket.off("tareaCompletada");
    };
  }, [socket]);

  const cargarProyecto = async () => {
    try {
      const res = await fetch(`https://green-api.onrender.com/api/projects/${id}`);
      const data = await res.json();
      setProject(data);
    } catch (err) {
      console.error("Error al cargar el proyecto", err);
    }
  };

  const agregarTarea = async () => {
    if (!nuevaTarea.trim()) return;
    try {
      await fetch(`https://green-api.onrender.com/api/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo: nuevaTarea, projectId: id }),
      });
      setNuevaTarea("");
      cargarProyecto();
    } catch (err) {
      console.error("Error al crear la tarea", err);
    }
  };

  if (!project) return <p className="p-5">Cargando proyecto...</p>;

  return (
    <div className="d-flex vh-100 bg-light">
      {/* Sidebar */}
      <div className="bg-success text-white p-3" style={{ width: "260px" }}>
        <h4 className="text-center mb-4">Proyecto</h4>
        <button className="btn btn-light w-100 mb-2" onClick={() => nav("/admin")}>
          ← Volver
        </button>
        <button className="btn btn-danger w-100 mt-4" onClick={() => nav("/login")}>
          🔒 Cerrar Sesión
        </button>
      </div>

      {/* Main */}
      <div className="flex-grow-1 p-5 overflow-auto">
        <h2 className="text-success fw-bold">{project.name}</h2>
        <p className="text-muted">Gestión de tareas del proyecto.</p>

        {/* Crear nueva tarea */}
        <div className="card p-3 mb-4 shadow-sm">
          <h5>Agregar nueva tarea</h5>
          <div className="d-flex mt-2">
            <input
              type="text"
              placeholder="Título de la tarea"
              value={nuevaTarea}
              onChange={(e) => setNuevaTarea(e.target.value)}
              className="form-control me-2"
            />
            <button className="btn btn-success" onClick={agregarTarea}>
              Agregar
            </button>
          </div>
        </div>

        {/* Lista de tareas */}
        <div>
          <h5 className="mb-3">🧾 Tareas del proyecto</h5>
          <ul className="list-group">
            {project.tareas && project.tareas.length > 0 ? (
              project.tareas.map((t) => (
                <li
                  key={t._id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <strong>{t.titulo}</strong>
                    {t.completada && (
                      <span className="badge bg-success ms-2">Completada</span>
                    )}
                  </div>
                  {t.evidencia && (
                    <a
                      href={t.evidencia}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-primary btn-sm"
                    >
                      📎 Ver evidencia
                    </a>
                  )}
                </li>
              ))
            ) : (
              <li className="list-group-item text-muted">
                No hay tareas registradas aún.
              </li>
            )}
          </ul>
        </div>

        {/* Notificaciones */}
        {notificaciones.length > 0 && (
          <div className="mt-4">
            <h5>🔔 Actividad reciente</h5>
            <ul className="list-group mt-2">
              {notificaciones.map((n, i) => (
                <li key={i} className="list-group-item">{n}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
