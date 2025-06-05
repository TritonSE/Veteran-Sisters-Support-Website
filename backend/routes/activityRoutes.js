import express from "express";
import {
  getUnreadActivities,
  createActivity,
  createAnnouncement,
  getAnnouncements,
} from "../controllers/activityController.js";
import { authenticateUser } from "../middleware/auth.js";
import { authenticateStaffOrAdmin } from "../middleware/profile.js";

const router = express.Router();

router.get("/activities/:userId", authenticateUser, getUnreadActivities);

router.post("/activities", authenticateUser, createActivity);

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
