import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../contexts/SocketContext";

export default function AdminDashboard() {
  const nav = useNavigate();
  const socket = useContext(SocketContext);
  const API_URL = "https://green-api.onrender.com/api";

  const [proyectos, setProyectos] = useState([]);
  const [nuevoProyecto, setNuevoProyecto] = useState("");
  const [notificaciones, setNotificaciones] = useState([]);

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

    return () => {
      socket?.off("tareaCompletada");
    };
  }, [socket]);

  // 🔹 Cargar proyectos actuales
  const cargarProyectos = async () => {
    try {
      const res = await fetch(`${API_URL}/projects`);
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nuevoProyecto }),
      });

      if (res.ok) {
        setNuevoProyecto("");
        cargarProyectos();
        socket?.emit("nuevoProyecto", { name: nuevoProyecto });
      } else {
        alert("❌ Error al crear el proyecto.");
      }
    } catch (error) {
      console.error("❌ Error al crear proyecto:", error);
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

      {/* Main Content */}
      <main className="flex-grow-1 p-5 overflow-auto">
        <header className="mb-4">
          <h2 className="text-success fw-bold">
            👋 Bienvenido, Administrador
          </h2>
          <p className="text-muted">
            Gestiona los proyectos, asigna tareas y monitorea el progreso de tu
            equipo en tiempo real.
          </p>
        </header>

        {/* Crear Proyecto */}
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

        {/* Listado de Proyectos */}
        <section>
          <h5 className="mb-3 fw-bold">📂 Proyectos actuales</h5>
          {proyectos.length === 0 ? (
            <div className="alert alert-secondary">
              No hay proyectos registrados aún.
            </div>
          ) : (
            <div className="row">
              {proyectos.map((p) => (
                <div key={p._id} className="col-md-4 mb-4">
                  <div className="card shadow-sm p-3 h-100 border-0">
                    <h6 className="fw-bold text-success">{p.name}</h6>
                    <p className="text-muted small mb-2">
                      {p.tareas?.length || 0} tareas asignadas
                    </p>
                    <button
                      className="btn btn-outline-success btn-sm"
                      onClick={() => nav(`/admin/project/${p._id}`)}
                    >
                      Ver Detalles
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
