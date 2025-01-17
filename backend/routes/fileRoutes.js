import express from "express";

import * as FileController from "../controllers/fileController.js";

const router = express.Router();

router.post("/", FileController.uploadFile);

export default router;
