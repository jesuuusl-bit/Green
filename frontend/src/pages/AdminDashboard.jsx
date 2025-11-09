import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../contexts/SocketContext";

export default function AdminDashboard() {
  const nav = useNavigate();
  const socket = useContext(SocketContext);
  const API_URL = import.meta.env.VITE_API_URL;

  const [proyectos, setProyectos] = useState([]);
  const [nuevoProyecto, setNuevoProyecto] = useState("");
  const [notificaciones, setNotificaciones] = useState([]);
  const [nuevaTarea, setNuevaTarea] = useState({ titulo: "", descripcion: "" });

  useEffect(() => {
    cargarProyectos();

    if (socket) {
      socket.on("tareaCompletada", (data) => {
        setNotificaciones((prev) => [
          ...prev,
          `✅ ${data.operator || "Un operador"} completó la tarea: ${data.tarea}`,
        ]);
      });
    }

    return () => socket?.off("tareaCompletada");
  }, [socket]);

  // 🔹 Cargar proyectos
  const cargarProyectos = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProyectos(data);
    } catch (error) {
      console.error("❌ Error al cargar proyectos:", error);
    }
  };

  // 🔹 Crear nuevo proyecto
  const crearProyecto = async () => {
    if (!nuevoProyecto.trim()) return alert("Por favor ingresa un nombre.");

    try {
      const res = await fetch(`${API_URL}/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name: nuevoProyecto }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ Error del backend:", errorText);
        return alert("Error al crear el proyecto. Revisa la consola.");
      }

      const nuevo = await res.json();
      setProyectos((prev) => [...prev, nuevo]);
      setNuevoProyecto("");
      socket?.emit("nuevoProyecto", { name: nuevo.name });
    } catch (error) {
      console.error("❌ Error al crear proyecto:", error);
      alert("Error al conectar con el servidor.");
    }
  };

  // 🔹 Crear tarea dentro de un proyecto
  const crearTarea = async (projectId) => {
    if (!nuevaTarea.titulo.trim()) return alert("Escribe un título para la tarea.");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          titulo: nuevaTarea.titulo,
          descripcion: nuevaTarea.descripcion,
          projectId,
        }),
      });

      if (res.ok) {
        alert("✅ Tarea creada correctamente");
        setNuevaTarea({ titulo: "", descripcion: "" });
        cargarProyectos();
      } else {
        alert("❌ Error al crear tarea");
      }
    } catch (err) {
      console.error("Error al crear tarea:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    nav("/login");
  };

  return (
    <div className="d-flex vh-100 bg-light">
      {/* Sidebar */}
      <aside
        className="bg-success text-white p-3 d-flex flex-column justify-content-between"
        style={{ width: "260px" }}
      >
        <div>
          <h4 className="text-center mb-4">Panel Admin</h4>
          <button
            className="btn btn-light w-100 mb-3"
            onClick={() => nav("/admin/add-user")}
          >
            ➕ Agregar Usuario
          </button>
          <button
            className="btn btn-light w-100 mb-3"
            onClick={() => nav("/admin/reports")}
          >
            📊 Ver Reportes
          </button>
        </div>
        <button className="btn btn-danger w-100 mt-4" onClick={handleLogout}>
          🔒 Cerrar Sesión
        </button>
      </aside>

      {/* Main */}
      <main className="flex-grow-1 p-5 overflow-auto">
        <h2 className="text-success fw-bold">👋 Bienvenido, Administrador</h2>
        <p className="text-muted">
          Gestiona los proyectos, asigna tareas y monitorea el progreso en tiempo real.
        </p>

        {/* Crear proyecto */}
        <section className="card p-3 mb-4 shadow-sm border-0">
          <h5 className="text-success mb-2 fw-bold">📁 Crear nuevo proyecto</h5>
          <div className="d-flex mt-2">
            <input
              type="text"
              placeholder="Nombre del proyecto"
              value={nuevoProyecto}
              onChange={(e) => setNuevoProyecto(e.target.value)}
              className="form-control me-2"
            />
            <button className="btn btn-success" onClick={crearProyecto}>
              Crear
            </button>
          </div>
        </section>

        {/* Lista de proyectos */}
        <section>
          <h5 className="mb-3 fw-bold">📂 Proyectos actuales</h5>
          {proyectos.length === 0 ? (
            <div className="alert alert-secondary">No hay proyectos aún.</div>
          ) : (
            <div className="row">
              {proyectos.map((p) => (
                <div key={p._id} className="col-md-4 mb-4">
                  <div className="card shadow-sm p-3 h-100 border-0">
                    <h6 className="fw-bold text-success">{p.name}</h6>
                    <p className="text-muted small mb-2">
                      {p.tareas?.length || 0} tareas asignadas
                    </p>

                    {/* 🔹 Crear tarea */}
                    <input
                      type="text"
                      placeholder="Título de la tarea"
                      value={nuevaTarea.titulo}
                      onChange={(e) =>
                        setNuevaTarea((prev) => ({
                          ...prev,
                          titulo: e.target.value,
                        }))
                      }
                      className="form-control mb-2"
                    />
                    <textarea
                      placeholder="Descripción"
                      value={nuevaTarea.descripcion}
                      onChange={(e) =>
                        setNuevaTarea((prev) => ({
                          ...prev,
                          descripcion: e.target.value,
                        }))
                      }
                      className="form-control mb-2"
                    ></textarea>
                    <button
                      className="btn btn-success btn-sm w-100"
                      onClick={() => crearTarea(p._id)}
                    >
                      ➕ Añadir tarea
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Notificaciones */}
        {notificaciones.length > 0 && (
          <section className="mt-4">
            <h5 className="fw-bold text-success">🔔 Actividad reciente</h5>
            <ul className="list-group mt-2">
              {notificaciones.map((n, i) => (
                <li key={i} className="list-group-item">
                  {n}
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}
