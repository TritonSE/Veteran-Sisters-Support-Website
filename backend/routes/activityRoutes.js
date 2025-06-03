import express from "express";
import {
  getUnreadActivities,
  createActivity,
  getActivities,
} from "../controllers/activityController.js";
import { authenticateUser } from "../middleware/auth.js";
import { authenticateProfilePermissions } from "../middleware/profile.js";

const router = express.Router();

router.get(
  "/activities/unread/:userId",
  authenticateUser,
  authenticateProfilePermissions,
  getUnreadActivities,
);
router.get("/activities/:userId", authenticateUser, authenticateProfilePermissions, getActivities);

export default router;
