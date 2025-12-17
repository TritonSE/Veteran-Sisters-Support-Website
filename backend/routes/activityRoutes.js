import express from "express";
import {
  getUnreadActivities,
  createAnnouncement,
  getActivities,
  getAnnouncements,
  getActivity,
} from "../controllers/activityController.js";
import { authenticateUser } from "../middleware/auth.js";
import { authenticateProfilePermissions, authenticateStaffOrAdmin } from "../middleware/profile.js";
import { authenticateActivityPermissions } from "../middleware/activity.js";

const router = express.Router();

router.get(
  "/activities/unread/:userId",
  authenticateUser,
  authenticateProfilePermissions,
  getUnreadActivities,
);
router.get(
  "/activities/all/:userId",
  authenticateUser,
  authenticateProfilePermissions,
  getActivities,
);

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

router.get(
  "/activities/:activityId",
  authenticateUser,
  authenticateActivityPermissions,
  getActivity,
);

export default router;
