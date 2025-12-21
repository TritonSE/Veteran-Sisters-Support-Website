import express from "express";
import {
  queryActiveVolunteersVeteranByEmail,
  queryActiveVolunteersVolunteerByEmail,
  addVolunteer,
  removeVolunteer,
  removeAllAssignedVolunteersWithVeteranEmail,
  removeAllAssignedVeteransWithVolunteerId,
} from "../controllers/activeVolunteersController.js";
import { authenticateUser } from "../middleware/auth.js";
import {
  authenticateProfilePermissionsByEmail,
  authenticateStaffOrAdmin,
} from "../middleware/profile.js";
const router = express.Router();

// All active volunteers routes require authentication
router.get(
  "/activeVolunteers/veteran/:email",
  authenticateUser,
  authenticateProfilePermissionsByEmail,
  queryActiveVolunteersVeteranByEmail,
);
router.get(
  "/activeVolunteers/volunteer/:email",
  authenticateUser,
  authenticateProfilePermissionsByEmail,
  queryActiveVolunteersVolunteerByEmail,
);
router.post("/activeVolunteers", authenticateUser, authenticateStaffOrAdmin, addVolunteer);
router.delete("/activeVolunteers/:id", authenticateUser, authenticateStaffOrAdmin, removeVolunteer);
router.delete(
  "/activeVolunteers/veteran/:email",
  authenticateUser,
  authenticateStaffOrAdmin,
  removeAllAssignedVolunteersWithVeteranEmail,
);
router.delete(
  "/activeVolunteers/volunteer/:id",
  authenticateUser,
  authenticateStaffOrAdmin,
  removeAllAssignedVeteransWithVolunteerId,
);

export default router;
