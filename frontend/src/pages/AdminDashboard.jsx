import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const nav = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [proyectos, setProyectos] = useState([]);
  const [nuevoProyecto, setNuevoProyecto] = useState("");
  const [tareasPorProyecto, setTareasPorProyecto] = useState({});

  useEffect(() => {
    cargarProyectos();
  }, []);

  const cargarProyectos = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProyectos(data);
    } catch (error) {
      console.error("Error al cargar proyectos:", error);
    }
  };

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
      if (res.ok) {
        setNuevoProyecto("");
        cargarProyectos();
      } else {
        const err = await res.json();
        alert(err.error || "Error al crear proyecto");
      }
    } catch (error) {
      console.error("Error al crear proyecto:", error);
    }
  };

  const cargarTareas = async (projectId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/tasks/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTareasPorProyecto((prev) => ({ ...prev, [projectId]: data }));
    } catch (error) {
      console.error("Error al cargar tareas:", error);
    }
  };

  const crearTarea = async (projectId) => {
    const titulo = prompt("Título de la tarea:");
    const descripcion = prompt("Descripción (opcional):");
    if (!titulo) return;
    try {
      const res = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ titulo, descripcion, projectId }),
      });
      if (res.ok) {
        alert("Tarea creada correctamente");
        cargarTareas(projectId);
      } else {
        const err = await res.json();
        alert(err.message || "Error al crear tarea");
      }
    } catch (error) {
      console.error("Error al crear tarea:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    nav("/login");
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-success">Panel de Administración</h2>
        <button className="btn btn-outline-danger" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </div>

      <div className="card shadow-sm p-4 mb-4 border-0">
        <h5 className="fw-semibold text-success mb-3">Crear nuevo proyecto</h5>
        <div className="d-flex">
          <input
            type="text"
            placeholder="Nombre del proyecto"
            className="form-control me-2"
            value={nuevoProyecto}
            onChange={(e) => setNuevoProyecto(e.target.value)}
          />
          <button className="btn btn-success" onClick={crearProyecto}>
            Crear
          </button>
        </div>
      </div>

      <div className="card shadow-sm p-4 border-0">
        <h5 className="fw-semibold text-success mb-3">Proyectos actuales</h5>
        {proyectos.length === 0 ? (
          <div className="alert alert-secondary">No hay proyectos registrados.</div>
        ) : (
          <table className="table align-middle table-hover">
            <thead>
              <tr className="table-success text-center">
                <th>Nombre</th>
                <th>Creado por</th>
                <th>Tareas</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {proyectos.map((p) => (
                <React.Fragment key={p._id}>
                  <tr className="text-center">
                    <td>{p.name}</td>
                    <td>{p.createdBy?.name || "Desconocido"}</td>
                    <td>{p.tareas?.length || 0}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-success me-2"
                        onClick={() => crearTarea(p._id)}
                      >
                        Añadir tarea
                      </button>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => cargarTareas(p._id)}
                      >
                        Ver tareas
                      </button>
                    </td>
                  </tr>
                  {tareasPorProyecto[p._id] && (
                    <tr>
                      <td colSpan="4">
                        <table className="table table-bordered mt-2">
                          <thead className="table-light">
                            <tr>
                              <th>Título</th>
                              <th>Descripción</th>
                              <th>Estado</th>
                              <th>Evidencia</th>
                            </tr>
                          </thead>
                          <tbody>
                            {tareasPorProyecto[p._id].length === 0 ? (
                              <tr>
                                <td colSpan="4" className="text-center text-muted">
                                  No hay tareas para este proyecto
                                </td>
                              </tr>
                            ) : (
                              tareasPorProyecto[p._id].map((t) => (
                                <tr key={t._id}>
                                  <td>{t.titulo}</td>
                                  <td>{t.descripcion || "Sin descripción"}</td>
                                  <td>
                                    {t.completada ? (
                                      <span className="badge bg-success">Completada</span>
                                    ) : (
                                      <span className="badge bg-warning text-dark">Pendiente</span>
                                    )}
                                  </td>
                                  <td>
                                    {t.evidencia ? (
                                      <a
                                        href={t.evidencia}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-success"
                                      >
                                        Ver evidencia
                                      </a>
                                    ) : (
                                      "Sin evidencia"
                                    )}
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
