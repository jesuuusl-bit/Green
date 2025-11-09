import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const nav = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const [proyectos, setProyectos] = useState([]);
  const [nuevoProyecto, setNuevoProyecto] = useState("");
  const [nuevaTarea, setNuevaTarea] = useState({ titulo: "", descripcion: "", projectId: "" });

  useEffect(() => { cargarProyectos(); }, []);

  const cargarProyectos = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/projects`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setProyectos(data);
  };

  const crearProyecto = async () => {
    const token = localStorage.getItem("token");
    await fetch(`${API_URL}/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: nuevoProyecto }),
    });
    setNuevoProyecto("");
    cargarProyectos();
  };

  const crearTarea = async () => {
    const token = localStorage.getItem("token");
    await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(nuevaTarea),
    });
    setNuevaTarea({ titulo: "", descripcion: "", projectId: "" });
    cargarProyectos();
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Panel del Administrador</h2>

      <div className="card p-3 mb-4">
        <h5>Crear nuevo proyecto</h5>
        <div className="d-flex">
          <input
            className="form-control me-2"
            placeholder="Nombre del proyecto"
            value={nuevoProyecto}
            onChange={(e) => setNuevoProyecto(e.target.value)}
          />
          <button className="btn btn-success" onClick={crearProyecto}>Crear</button>
        </div>
      </div>

      <div className="card p-3 mb-4">
        <h5>Asignar tarea a un proyecto</h5>
        <div className="row g-2">
          <div className="col-md-3">
            <input
              className="form-control"
              placeholder="Título"
              value={nuevaTarea.titulo}
              onChange={(e) => setNuevaTarea({ ...nuevaTarea, titulo: e.target.value })}
            />
          </div>
          <div className="col-md-4">
            <input
              className="form-control"
              placeholder="Descripción"
              value={nuevaTarea.descripcion}
              onChange={(e) => setNuevaTarea({ ...nuevaTarea, descripcion: e.target.value })}
            />
          </div>
          <div className="col-md-3">
            <select
              className="form-select"
              value={nuevaTarea.projectId}
              onChange={(e) => setNuevaTarea({ ...nuevaTarea, projectId: e.target.value })}
            >
              <option value="">Seleccionar proyecto</option>
              {proyectos.map((p) => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <button className="btn btn-primary w-100" onClick={crearTarea}>Añadir</button>
          </div>
        </div>
      </div>

      <h5>Lista de proyectos</h5>
      <table className="table table-bordered table-striped mt-3">
        <thead>
          <tr>
            <th>Proyecto</th>
            <th>Creado por</th>
            <th>Tareas</th>
          </tr>
        </thead>
        <tbody>
          {proyectos.map((p) => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{p.createdBy?.name || "Desconocido"}</td>
              <td>
                {p.tareas?.length ? (
                  <ul className="mb-0">
                    {p.tareas.map((t) => (
                      <li key={t._id}>
                        {t.titulo} - {t.completada ? "Completada" : "Pendiente"}
                      </li>
                    ))}
                  </ul>
                ) : "Sin tareas"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
