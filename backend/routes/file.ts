import express from "express";

import * as FileController from "../controllers/file";

const router = express.Router();

router.post("/", FileController.uploadFile);

export default router;
