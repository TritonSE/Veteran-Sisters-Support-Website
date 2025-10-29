import express from "express";
import {
  getUnreadActivities,
  createActivity,
  createAnnouncement,
  getActivities,
  getAnnouncements,
} from "../controllers/activityController.js";
import { authenticateUser } from "../middleware/auth.js";
import { authenticateProfilePermissions, authenticateStaffOrAdmin } from "../middleware/profile.js";

const router = express.Router();

router.get(
  "/activities/unread/:userId",
  authenticateUser,
  authenticateProfilePermissions,
  getUnreadActivities,
);
router.get("/activities/:userId", authenticateUser, authenticateProfilePermissions, getActivities);

router.post(
  "/activities/announcement",
  authenticateUser,
  authenticateStaffOrAdmin,
  createAnnouncement,
);

router.get(
  "/activities/announcements/:userId",
  authenticateUser,
  authenticateStaffOrAdmin,
  getAnnouncements,
);

export default router;
