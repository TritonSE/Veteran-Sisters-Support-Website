import express from "express";
import * as FileController from "../controllers/fileController.js";
import { authenticateUser } from "../middleware/auth.js";
import { authenticateDocumentPermissions } from "../middleware/documents.js";
import { authenticateProfilePermissions } from "../middleware/profile.js";
const router = express.Router();

// All file routes require authentication
router.post("/file", authenticateUser, FileController.uploadFile);
router.get(
  "/file/uploader/:userId",
  authenticateUser,
  authenticateProfilePermissions,
  FileController.getFileByUploader,
);
router.get(
  "/file/:id",
  authenticateUser,
  authenticateDocumentPermissions,
  FileController.getFileById,
);
router.put(
  "/file/:id",
  authenticateUser,
  authenticateDocumentPermissions,
  FileController.editFileById,
);

export default router;
