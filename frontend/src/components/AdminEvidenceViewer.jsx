import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function AdminEvidenceViewer() {
  const { state } = useLocation();
  const nav = useNavigate();
  const evidencia = state?.evidencia;

  if (!evidencia)
    return (
      <div className="p-5 text-center">
        <h5>No se encontró evidencia para esta tarea.</h5>
        <button className="btn btn-success mt-3" onClick={() => nav(-1)}>
          Volver
        </button>
      </div>
    );

  const isImage = evidencia.match(/\.(jpg|jpeg|png|gif)$/i);
  const isPDF = evidencia.match(/\.pdf$/i);

  return (
    <div className="container py-4">
      <button className="btn btn-secondary mb-3" onClick={() => nav(-1)}>
        ⬅ Volver
      </button>

      <h4 className="text-success fw-bold mb-4">📎 Evidencia de la tarea</h4>

      {isImage && (
        <img
          src={evidencia}
          alt="Evidencia"
          className="img-fluid border rounded shadow-sm"
          style={{ maxHeight: "70vh", objectFit: "contain" }}
        />
      )}

      {isPDF && (
        <iframe
          src={evidencia}
          title="Evidencia PDF"
          width="100%"
          height="600px"
          className="border rounded shadow-sm"
        />
      )}

      {!isImage && !isPDF && (
        <p className="text-muted">Archivo no compatible para previsualizar.</p>
      )}
    </div>
  );
}
