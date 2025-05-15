import express from "express";
import {
  queryActiveVolunteersVeteranByEmail,
  queryActiveVolunteersVolunteerByEmail,
  addVolunteer,
  removeVolunteer,
} from "../controllers/activeVolunteersController.js";
import { authenticateUser } from "../middleware/auth.js";
import { authenticateProfilePermissionsByEmail, authenticateStaffOrAdmin } from "../middleware/profile.js";
const router = express.Router();

// All active volunteers routes require authentication
router.get("/activeVolunteers/veteran/:email", authenticateUser, authenticateProfilePermissionsByEmail, queryActiveVolunteersVeteranByEmail);
router.get("/activeVolunteers/volunteer/:email", authenticateUser, authenticateProfilePermissionsByEmail, queryActiveVolunteersVolunteerByEmail);
router.post("/activeVolunteers", authenticateUser, authenticateStaffOrAdmin, addVolunteer);
router.delete("/activeVolunteers/:id", authenticateUser, authenticateStaffOrAdmin, removeVolunteer);

export default router;
