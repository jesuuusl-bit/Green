import mongoose from "mongoose";
import { GridFsStorage } from "multer-gridfs-storage";
import dotenv from "dotenv";

dotenv.config();

const mongoURI = process.env.MONGO_URI;

const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return {
      bucketName: "evidencias", // nombre de la colección
      filename: `${Date.now()}-${file.originalname}`,
    };
  },
});

export default storage;
