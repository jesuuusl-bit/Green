import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import OperatorDashboard from "./pages/OperatorDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AddUser from "./pages/Admin/AddUser";
import PrivateRoute from "./components/PrivateRoute";
import ProjectDetails from "./pages/ProjectDetails"; // 🆕 Import nuevo

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
          <Routes>
            {/* Redirección base */}
            <Route path="/" element={<Navigate to="/login" />} />

            {/* Login */}
            <Route path="/login" element={<Login />} />

            {/* Panel Admin */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Crear usuario (solo admin) */}
            <Route
              path="/admin/add-user"
              element={
                <PrivateRoute role="admin">
                  <AddUser />
                </PrivateRoute>
              }
            />

            {/* Nueva ruta: Detalles de proyecto */}
            <Route
              path="/admin/project/:id"
              element={
                <PrivateRoute role="admin">
                  <ProjectDetails />
                </PrivateRoute>
              }
            />

            {/* Panel Operador */}
            <Route
              path="/operator"
              element={
                <ProtectedRoute allowedRoles={["operator", "admin"]}>
                  <OperatorDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
