import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../contexts/SocketContext";
import EvidenceUploader from "../components/EvidenceUploader";

export default function OperatorDashboard() {
  const nav = useNavigate();
  const socket = useContext(SocketContext);
  const [proyectos, setProyectos] = useState([]);

  const API_URL = "https://green-api.onrender.com/api";

  useEffect(() => {
    cargarProyectos();

    if (socket) {
      socket.on("actualizacionProyecto", () => cargarProyectos());
    }

    return () => {
      socket?.off("actualizacionProyecto");
    };
  }, [socket]);

  // 🔹 Cargar proyectos con tareas asignadas
  const cargarProyectos = async () => {
    try {
      const res = await fetch(`${API_URL}/projects`);
      const data = await res.json();
      setProyectos(data);
    } catch (error) {
      console.error("❌ Error al cargar proyectos:", error);
    }
  };

  // 🔹 Completar tarea con evidencia
  const completarTarea = async (projectId, tareaId, evidencia) => {
    try {
      const formData = new FormData();
      formData.append("file", evidencia);
      formData.append("tareaId", tareaId);
      formData.append("projectId", projectId);

      const res = await fetch(`${API_URL}/tasks/complete`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        alert("✅ Tarea completada y evidencia enviada correctamente.");
        socket?.emit("tareaCompletada", { tareaId, projectId });
        cargarProyectos();
      } else {
        alert("❌ Error al completar la tarea.");
      }
    } catch (error) {
      console.error("❌ Error al enviar evidencia:", error);
    }
  };

  // 🔹 Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("token");
    nav("/login");
  };

  return (
    <div className="d-flex vh-100 bg-light">
      {/* Sidebar */}
      <div className="bg-success text-white p-3" style={{ width: "260px" }}>
        <h4 className="text-center mb-4">Panel del Operador</h4>
        <button className="btn btn-danger w-100 mt-4" onClick={handleLogout}>
          🔒 Cerrar Sesión
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-5 overflow-auto">
        <h2 className="text-success fw-bold">👷 Bienvenido, Operador</h2>
        <p className="text-muted">Gestiona tus tareas y sube evidencias.</p>

        {proyectos.map((p) => (
          <div key={p._id} className="card mb-4 shadow-sm p-3">
            <h5 className="fw-bold text-success">{p.name}</h5>
            <p className="text-muted">{p.descripcion || "Sin descripción."}</p>

            <ul className="list-group mt-2">
              {p.tareas && p.tareas.length > 0 ? (
                p.tareas.map((t) => (
                  <li
                    key={t._id}
                    className="list-group-item d-flex justify-content-between align-items-center flex-wrap"
                  >
                    <div>
                      <strong>{t.titulo}</strong>
                      <br />
                      <small className="text-muted">
                        {t.completada ? "Completada" : "Pendiente"}
                      </small>
                    </div>

                    {!t.completada ? (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const file = e.target.elements.file.files[0];
                          completarTarea(p._id, t._id, file);
                        }}
                        className="d-flex align-items-center mt-2 mt-md-0"
                      >
                        <input
                          type="file"
                          name="file"
                          className="form-control form-control-sm me-2"
                          required
                        />
                        <button type="submit" className="btn btn-success btn-sm">
                          📤 Enviar Evidencia
                        </button>
                      </form>
                    ) : (
                      <span className="badge bg-success">✅ Completada</span>
                    )}
                  </li>
                ))
              ) : (
                <li className="list-group-item text-muted">
                  No hay tareas asignadas.
                </li>
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
