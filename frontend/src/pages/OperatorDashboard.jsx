import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function OperatorDashboard() {
  const API_URL = import.meta.env.VITE_API_URL;
  const nav = useNavigate();

  const [proyectos, setProyectos] = useState([]);
  const [tareasPorProyecto, setTareasPorProyecto] = useState({});
  const [subiendo, setSubiendo] = useState(false);

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

  const completarTarea = async (tareaId, projectId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/tasks/${tareaId}/complete`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        alert("Tarea marcada como completada");
        cargarTareas(projectId);
      } else {
        const err = await res.json();
        alert(err.message || "Error al completar tarea");
      }
    } catch (error) {
      console.error("Error al completar tarea:", error);
    }
  };

  const subirEvidencia = async (tareaId, projectId, file) => {
    if (!file) return alert("Selecciona un archivo");
    setSubiendo(true);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${API_URL}/tasks/${tareaId}/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        alert("Evidencia subida correctamente");
        cargarTareas(projectId);
      } else {
        const err = await res.json();
        alert(err.message || "Error al subir evidencia");
      }
    } catch (error) {
      console.error("Error al subir evidencia:", error);
    } finally {
      setSubiendo(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    nav("/login");
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-success">Panel del Operador</h2>
        <button className="btn btn-outline-danger" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </div>

      <div className="card shadow-sm p-4 border-0">
        <h5 className="fw-semibold text-success mb-3">Proyectos asignados</h5>
        {proyectos.length === 0 ? (
          <div className="alert alert-secondary">No hay proyectos disponibles.</div>
        ) : (
          <table className="table align-middle table-hover">
            <thead>
              <tr className="table-success text-center">
                <th>Proyecto</th>
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
                                      <div className="d-flex">
                                        <input
                                          type="file"
                                          className="form-control form-control-sm me-2"
                                          accept="image/*,.pdf"
                                          onChange={(e) =>
                                            subirEvidencia(t._id, p._id, e.target.files[0])
                                          }
                                          disabled={subiendo}
                                        />
                                        <button
                                          className="btn btn-sm btn-outline-success"
                                          onClick={() => completarTarea(t._id, p._id)}
                                          disabled={t.completada}
                                        >
                                          Completar
                                        </button>
                                      </div>
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
