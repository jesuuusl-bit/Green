import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import OperatorDashboard from "./pages/OperatorDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AddUser from "./pages/Admin/AddUser";
import PrivateRoute from "./components/PrivateRoute";
import * as Sentry from "@sentry/react";
import { browserTracingIntegration, replayIntegration } from "@sentry/react";

Sentry.init({
  dsn: "https://d2cfb418c2905c91b0e75ed7583c11f5@o4510318083112960.ingest.us.sentry.io/4510318138490880",
  integrations: [
    browserTracingIntegration(),
    replayIntegration(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/add-user"
            element={
              <PrivateRoute role="admin">
                <AddUser />
              </PrivateRoute>
            }
          />
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
