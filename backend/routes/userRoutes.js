import express from "express";
import {
  queryUsers,
  getUserByEmail,
  addUser,
  deleteUser,
  getUserById,
  getUsersNonAdmins,
  getUserRole,
  updateUser,
  getVeteransByVolunteer,
  updateUserId,
  markActivityRead,
} from "../controllers/userController.js";
import { authenticateUser } from "../middleware/auth.js";

const router = express.Router();

// Public routes (no authentication required)
router.post("/users", addUser); // Signup endpoint

// Protected routes (authentication required)
router.get("/users", authenticateUser, queryUsers);
router.get("/users/email/:email", authenticateUser, getUserByEmail);
router.get("/users/id/:id", authenticateUser, getUserById);
router.get("/nonAdminUsers", authenticateUser, getUsersNonAdmins);
router.get("/veterans/:volunteerId", authenticateUser, getVeteransByVolunteer);
router.delete("/users/:email", authenticateUser, deleteUser);
router.get("/users/role/:email", authenticateUser, getUserRole);
router.patch("/users/id/:id", authenticateUser, updateUserId);
router.put("/users/:email", authenticateUser, updateUser);
router.put("/users/activity/:id", authenticateUser, markActivityRead);

export default router;
