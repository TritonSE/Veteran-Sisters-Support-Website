import express from "express";
import {
  getUserByEmail,
  addUser,
  getUserById,
  getUsersNonAdmins,
  updateUser,
  getVeteransByVolunteer,
  updateUserId,
  getVolunteersByProgram,
  getVeteransByProgram,
  deleteUser,
} from "../controllers/userController.js";
import { authenticateUser } from "../middleware/auth.js";
import { authenticateProfilePermissions, authenticateStaffOrAdmin, authenticateProfilePermissionsByEmail } from "../middleware/profile.js";
const router = express.Router();

// Public routes (no authentication required)
router.post("/users", addUser); // Signup endpoint

// Protected routes (authentication required)
router.get("/users/id/:userId", authenticateUser, authenticateProfilePermissions, getUserById);
router.get("/nonAdminUsers", authenticateUser, authenticateStaffOrAdmin, getUsersNonAdmins);
router.get("/veterans/:userId", authenticateUser, authenticateProfilePermissions, getVeteransByVolunteer);
router.patch("/users/id/:userId", authenticateUser, authenticateProfilePermissions, updateUserId);
router.get("/users/email/:email", authenticateUser, authenticateProfilePermissionsByEmail, getUserByEmail);
router.put("/users/:email", authenticateUser, authenticateStaffOrAdmin, updateUser);
router.get("/users/volunteersByProgram/:program", authenticateUser, authenticateStaffOrAdmin, getVolunteersByProgram);
router.get("/users/veteransByProgram/:program", authenticateUser, authenticateStaffOrAdmin,getVeteransByProgram);
router.delete("/users/:userId", authenticateUser, authenticateStaffOrAdmin, deleteUser);
export default router;
