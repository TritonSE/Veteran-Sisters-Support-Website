import express from "express";
import {
  getUnreadActivities,
  createActivity,
  markActivityRead,
} from "../controllers/activityController.js";

const router = express.Router();

router.get("/activities", getUnreadActivities);

router.post("/activities", createActivity);

router.patch("/activities/:activityId", markActivityRead);

export default router;
