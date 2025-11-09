import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function OperatorDashboard() {
  const API_URL = import.meta.env.VITE_API_URL;
  const nav = useNavigate();

  const [proyectos, setProyectos] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [tareas, setTareas] = useState([]);
  const [archivo, setArchivo] = useState(null);

  useEffect(() => {
    cargarProyectos();
  }, []);

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

  // 🔹 Cargar tareas del proyecto seleccionado
  const cargarTareas = async (projectId) => {
    setSelectedProject(projectId);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/tasks/project/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTareas(data);
    } catch (error) {
      console.error("❌ Error al cargar tareas:", error);
    }
  };

  // 🔹 Completar tarea
  const completarTarea = async (tareaId) => {
    if (!archivo) return alert("Por favor sube una evidencia (imagen o PDF).");
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("evidencia", archivo);

      const res = await fetch(`${API_URL}/tasks/${tareaId}/complete`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        alert("✅ Tarea completada y evidencia enviada");
        setArchivo(null);
        cargarTareas(selectedProject);
      } else {
        alert("❌ Error al completar tarea");
      }
    } catch (error) {
      console.error("❌ Error al enviar evidencia:", error);
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
        className="bg-primary text-white p-3 d-flex flex-column justify-content-between"
        style={{ width: "260px" }}
      >
        <div>
          <h4 className="text-center mb-4">Panel Operador</h4>
          <button className="btn btn-light w-100 mb-3" onClick={cargarProyectos}>
            🔄 Recargar proyectos
          </button>
        </div>
        <button className="btn btn-danger w-100 mt-4" onClick={handleLogout}>
          🔒 Cerrar Sesión
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-grow-1 p-5 overflow-auto">
        <h2 className="text-primary fw-bold">👋 Bienvenido, Operador</h2>
        <p className="text-muted">
          Aquí puedes ver tus proyectos, completar tareas y subir evidencias.
        </p>

        {/* 🔹 Lista de proyectos */}
        <section className="mb-4">
          <h5 className="fw-bold text-primary">📂 Mis proyectos</h5>
          {proyectos.length === 0 ? (
            <div className="alert alert-secondary">No tienes proyectos asignados.</div>
          ) : (
            <div className="row">
              {proyectos.map((p) => (
                <div key={p._id} className="col-md-4 mb-3">
                  <div
                    className={`card shadow-sm p-3 border-0 ${
                      selectedProject === p._id ? "border border-primary" : ""
                    }`}
                    onClick={() => cargarTareas(p._id)}
                    style={{ cursor: "pointer" }}
                  >
                    <h6 className="fw-bold text-primary">{p.name}</h6>
                    <p className="text-muted small">
                      {p.tareas?.length || 0} tareas asignadas
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 🔹 Tareas del proyecto */}
        {selectedProject && (
          <section>
            <h5 className="fw-bold text-primary">📝 Tareas del proyecto</h5>
            {tareas.length === 0 ? (
              <div className="alert alert-warning">No hay tareas asignadas.</div>
            ) : (
              tareas.map((t) => (
                <div key={t._id} className="card p-3 mb-3 shadow-sm border-0">
                  <h6 className="fw-bold text-primary">{t.titulo}</h6>
                  <p className="text-muted">{t.descripcion}</p>

                  {t.completada ? (
                    <span className="badge bg-success">Completada</span>
                  ) : (
                    <>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => setArchivo(e.target.files[0])}
                        className="form-control mb-2"
                      />
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => completarTarea(t._id)}
                      >
                        ✅ Marcar como completada
                      </button>
                    </>
                  )}
                </div>
              ))
            )}
          </section>
        )}
      </main>
    </div>
  );
}
