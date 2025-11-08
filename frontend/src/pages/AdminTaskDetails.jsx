import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminEvidenceViewer from "../components/AdminEvidenceViewer";

export default function AdminTaskDetails() {
  const { id } = useParams(); // ID del proyecto
  const nav = useNavigate();
  const API_URL = "https://green-api.onrender.com/api";

  const [proyecto, setProyecto] = useState(null);
  const [nuevaTarea, setNuevaTarea] = useState("");

  useEffect(() => {
    cargarProyecto();
  }, [id]);

  const cargarProyecto = async () => {
    try {
      const res = await fetch(`${API_URL}/projects/${id}`);
      const data = await res.json();
      setProyecto(data);
    } catch (error) {
      console.error("❌ Error al cargar proyecto:", error);
    }
  };

  const crearTarea = async () => {
    if (!nuevaTarea.trim()) return;
    try {
      const res = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: id, titulo: nuevaTarea }),
      });
      if (res.ok) {
        setNuevaTarea("");
        cargarProyecto();
      } else alert("Error al crear tarea");
    } catch (error) {
      console.error("❌ Error al crear tarea:", error);
    }
  };

  if (!proyecto) return <div className="p-5">Cargando proyecto...</div>;

  return (
    <div className="container py-4">
      <button className="btn btn-secondary mb-3" onClick={() => nav("/admin")}>
        ⬅ Volver
      </button>

      <h3 className="text-success fw-bold mb-3">
        Proyecto: {proyecto.name}
      </h3>

      {/* Crear tarea */}
      <div className="card p-3 mb-4 shadow-sm border-0">
        <h5 className="text-success mb-2 fw-bold">📝 Crear nueva tarea</h5>
        <div className="d-flex mt-2">
          <input
            type="text"
            placeholder="Título de la tarea"
            value={nuevaTarea}
            onChange={(e) => setNuevaTarea(e.target.value)}
            className="form-control me-2"
          />
          <button className="btn btn-success" onClick={crearTarea}>
            Crear
          </button>
        </div>
      </div>

      {/* Lista de tareas */}
      <div>
        <h5 className="fw-bold mb-3 text-success">📋 Tareas del proyecto</h5>
        {proyecto.tareas && proyecto.tareas.length > 0 ? (
          <ul className="list-group">
            {proyecto.tareas.map((t) => (
              <li
                key={t._id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>{t.titulo}</strong>
                  <br />
                  {t.completada ? (
                    <span className="badge bg-success">Completada</span>
                  ) : (
                    <span className="badge bg-warning text-dark">Pendiente</span>
                  )}
                </div>

                {t.evidencia && (
                  <button
                    className="btn btn-outline-success btn-sm"
                    onClick={() =>
                      nav(`/admin/evidence/${t._id}`, {
                        state: { evidencia: t.evidencia },
                      })
                    }
                  >
                    Ver evidencia
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="alert alert-secondary">No hay tareas registradas.</div>
        )}
      </div>
    </div>
  );
}
