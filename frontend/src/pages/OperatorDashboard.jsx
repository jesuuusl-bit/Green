import React, { useEffect, useState } from "react";

export default function OperatorDashboard() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [proyectos, setProyectos] = useState([]);

  useEffect(() => { cargarProyectos(); }, []);

  const cargarProyectos = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/projects`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setProyectos(data);
  };

  const completarTarea = async (tareaId) => {
    const evidencia = prompt("Ingresa un enlace o descripción de la evidencia:");
    const token = localStorage.getItem("token");

    await fetch(`${API_URL}/tasks/${tareaId}/complete`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ evidencia }),
    });

    cargarProyectos();
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Panel del Operador</h2>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Proyecto</th>
            <th>Tareas</th>
          </tr>
        </thead>
        <tbody>
          {proyectos.map((p) => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>
                {p.tareas?.length ? (
                  <ul>
                    {p.tareas.map((t) => (
                      <li key={t._id}>
                        {t.titulo} - {t.completada ? "Completada" : "Pendiente"}{" "}
                        {!t.completada && (
                          <button
                            className="btn btn-sm btn-outline-success ms-2"
                            onClick={() => completarTarea(t._id)}
                          >
                            Completar
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : "Sin tareas asignadas"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
