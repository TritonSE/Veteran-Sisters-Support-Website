import * as FileController from "../controllers/file";
import express from "express";

const router = express.Router();

router.post("/", FileController.uploadFile);

export default router;
