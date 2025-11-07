import React, { useState, useEffect, useContext } from "react";
import { SocketContext } from "../contexts/SocketContext";

export default function OperatorDashboard() {
  const socket = useContext(SocketContext);

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [formTask, setFormTask] = useState({ title: "", description: "" });
  const [formProject, setFormProject] = useState({
    name: "",
    description: "",
  });

  // Escucha en tiempo real los nuevos elementos
  useEffect(() => {
    socket.on("nuevaTarea", (data) => {
      setTasks((prev) => [data, ...prev]);
    });

    socket.on("nuevoProyecto", (data) => {
      setProjects((prev) => [data, ...prev]);
    });

    return () => {
      socket.off("nuevaTarea");
      socket.off("nuevoProyecto");
    };
  }, [socket]);

  // Cargar datos iniciales desde el backend
  useEffect(() => {
    fetch("https://green-api.onrender.com/api/tasks")
      .then((res) => res.json())
      .then(setTasks)
      .catch(() => console.warn("No se pudieron cargar las tareas"));

    fetch("https://green-api.onrender.com/api/projects")
      .then((res) => res.json())
      .then(setProjects)
      .catch(() => console.warn("No se pudieron cargar los proyectos"));
  }, []);

  // Crear tarea
  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    await fetch("https://green-api.onrender.com/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...formTask,
        createdBy: "Operador", // opcionalmente obtén el nombre real del usuario
      }),
    });
    setFormTask({ title: "", description: "" });
  };

  // Crear proyecto
  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    await fetch("https://green-api.onrender.com/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...formProject,
        createdBy: "Operador",
      }),
    });
    setFormProject({ name: "", description: "" });
  };

  return (
    <div className="container mt-5">
      <h2 className="text-success text-center mb-4">
        Panel del Operador 🌿
      </h2>

      <div className="row">
        {/* Crear tarea */}
        <div className="col-md-6">
          <div className="card p-3 shadow">
            <h5 className="text-success">📋 Crear nueva tarea</h5>
            <form onSubmit={handleTaskSubmit}>
              <input
                type="text"
                placeholder="Título"
                className="form-control mb-2"
                value={formTask.title}
                onChange={(e) =>
                  setFormTask({ ...formTask, title: e.target.value })
                }
                required
              />
              <textarea
                placeholder="Descripción"
                className="form-control mb-2"
                value={formTask.description}
                onChange={(e) =>
                  setFormTask({ ...formTask, description: e.target.value })
                }
              />
              <button className="btn btn-success w-100">Crear Tarea</button>
            </form>
          </div>
        </div>

        {/* Crear proyecto */}
        <div className="col-md-6">
          <div className="card p-3 shadow">
            <h5 className="text-success">🏗️ Crear nuevo proyecto</h5>
            <form onSubmit={handleProjectSubmit}>
              <input
                type="text"
                placeholder="Nombre del proyecto"
                className="form-control mb-2"
                value={formProject.name}
                onChange={(e) =>
                  setFormProject({ ...formProject, name: e.target.value })
                }
                required
              />
              <textarea
                placeholder="Descripción"
                className="form-control mb-2"
                value={formProject.description}
                onChange={(e) =>
                  setFormProject({
                    ...formProject,
                    description: e.target.value,
                  })
                }
              />
              <button className="btn btn-success w-100">
                Crear Proyecto
              </button>
            </form>
          </div>
        </div>
      </div>

      <hr className="my-4" />

      {/* Listas en tiempo real */}
      <div className="row">
        <div className="col-md-6">
          <h5>🟢 Tareas</h5>
          <ul className="list-group">
            {tasks.map((t, i) => (
              <li key={i} className="list-group-item">
                <strong>{t.title}</strong> — {t.description}
              </li>
            ))}
          </ul>
        </div>

        <div className="col-md-6">
          <h5>🔵 Proyectos</h5>
          <ul className="list-group">
            {projects.map((p, i) => (
              <li key={i} className="list-group-item">
                <strong>{p.name}</strong> — {p.description}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
