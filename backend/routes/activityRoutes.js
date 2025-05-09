import express from "express";
import {
  getUnreadActivities,
  createActivity,
  markActivityRead,
} from "../controllers/activityController.js";
import { authenticateUser } from "../middleware/auth.js";

const router = express.Router();

router.get("/activities/:userId", authenticateUser, getUnreadActivities);

router.post("/activities", authenticateUser, createActivity);

router.post("/activities/:activityId", authenticateUser, markActivityRead);

export default router;
