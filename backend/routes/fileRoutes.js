import express from "express";

import * as FileController from "../controllers/fileController.js";

const router = express.Router();

router.post("/file", FileController.uploadFile);
router.get("/files/:uploader", FileController.getFileByUploader);

export default router;
