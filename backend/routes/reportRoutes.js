import express from "express";
import * as ReportController from "../controllers/reportController.js";
import { authenticateUser } from "../middleware/auth.js";
import { getReportsByUser, addReport } from "../controllers/reportController.js";

const router = express.Router();

router.post("/report", authenticateUser, addReport);
router.get("/report/user/:userId", authenticateUser, getReportsByUser);

export default router;
