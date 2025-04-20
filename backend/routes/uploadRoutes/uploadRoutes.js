// routes/uploadRoutes.js
import express from "express";
import multer from "multer";
import { uploadFileHandler } from "../../controllers/upload-file-controllers/uploadFileHandler.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/files', upload.single('file'), uploadFileHandler);

export default router;
