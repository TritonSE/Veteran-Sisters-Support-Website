import express from "express";
import { authenticateUser } from "../middleware/auth.js";
import { authenticateReportPermissions } from "../middleware/report.js";
import { getReportsByUser, addReport } from "../controllers/reportController.js";

const router = express.Router();

router.post("/report", authenticateUser, addReport);
router.get(
  "/report/user/:userId",
  authenticateUser,
  authenticateReportPermissions,
  getReportsByUser,
);

export default router;
