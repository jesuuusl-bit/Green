import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import storage from "../config/gridfs.js";

const router = express.Router();
const upload = multer({ storage });

// Subir evidencia
router.post("/upload", upload.single("file"), (req, res) => {
  res.json({ file: req.file });
});

// Descargar evidencia
router.get("/:filename", async (req, res) => {
  try {
    const conn = mongoose.connection;
    const gfs = new mongoose.mongo.GridFSBucket(conn.db, {
      bucketName: "evidencias",
    });

    const file = await conn.db
      .collection("evidencias.files")
      .findOne({ filename: req.params.filename });

    if (!file) return res.status(404).json({ msg: "Archivo no encontrado" });

    gfs.openDownloadStreamByName(req.params.filename).pipe(res);
  } catch (err) {
    res.status(500).json({ msg: "Error al descargar evidencia" });
  }
});

export default router;
