import express from "express";

import * as FileController from "../controllers/fileController.js";

const router = express.Router();

router.post("/file", FileController.uploadFile);
router.get("/file/uploader/:id", FileController.getFileByUploader);
router.get("/file/:id", FileController.getFileById)

export default router;
