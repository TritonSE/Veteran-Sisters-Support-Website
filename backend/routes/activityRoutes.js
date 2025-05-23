import express from "express";
import {
  getUnreadActivities,
  createActivity,
  getActivities,
} from "../controllers/activityController.js";
import { authenticateUser } from "../middleware/auth.js";

const router = express.Router();

router.get("/activities/unread/:userId", authenticateUser, getUnreadActivities);
router.get("/activities/:userId", authenticateUser, getActivities);

export default router;
