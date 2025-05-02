import express from "express";
import * as FileController from "../controllers/fileController.js";
import { authenticateUser } from "../middleware/auth.js";

const router = express.Router();

// All file routes require authentication
router.post("/file", authenticateUser, FileController.uploadFile);
router.get("/file/uploader/:id", authenticateUser, FileController.getFileByUploader);
router.get("/file/:id", authenticateUser, FileController.getFileById);
router.put("/file/:id", authenticateUser, FileController.editFileById);

export default router;
