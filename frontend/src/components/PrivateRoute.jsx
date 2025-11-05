import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");

  // Si no hay token, redirige al login
  if (!token) {
    return <Navigate to="/login" />;
  }

  try {
    const decoded = jwtDecode(token);

    // Verifica que el token tenga un rol válido
    if (allowedRoles && !allowedRoles.includes(decoded.user.role)) {
      return <Navigate to="/login" />;
    }

    return children;
  } catch (error) {
    console.error("Error decodificando token:", error);
    return <Navigate to="/login" />;
  }
};

export default PrivateRoute;
