import React, { useState } from "react";

export default function EvidenceUploader({ onUpload }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Selecciona un archivo antes de subirlo.");

    setLoading(true);
    try {
      await onUpload(file);
      setFile(null);
      alert("✅ Evidencia subida correctamente.");
    } catch (error) {
      alert("❌ Error al subir evidencia.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="d-flex align-items-center mt-2">
      <input
        type="file"
        className="form-control form-control-sm me-2"
        onChange={(e) => setFile(e.target.files[0])}
        required
      />
      <button
        type="submit"
        className="btn btn-success btn-sm"
        disabled={loading}
      >
        {loading ? "Subiendo..." : "Subir evidencia"}
      </button>
    </form>
  );
}
