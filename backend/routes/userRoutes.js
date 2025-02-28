import express from "express";
import {
  queryUsers,
  getUserByEmail,
  addUser,
  deleteUser,
  getUsersNonAdmins,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/users", queryUsers);

router.get("/users/:email", getUserByEmail);

router.get("/nonAdminUsers", getUsersNonAdmins);

router.post("/users", addUser);

router.delete("/users/:email", deleteUser);

export default router;
