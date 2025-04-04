import express from "express";
import {
  queryActiveVolunteers,
  addVolunteer,
  removeVolunteer,
} from "../controllers/activeVolunteersController.js";
import { authenticateUser } from "../middleware/auth.js";

const router = express.Router();

// All active volunteers routes require authentication
router.get("/activeVolunteers", authenticateUser, queryActiveVolunteers);
router.post("/activeVolunteers", authenticateUser, addVolunteer);
router.delete("/activeVolunteers/:id", authenticateUser, removeVolunteer);

export default router;
