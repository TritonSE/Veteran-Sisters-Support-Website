import express from "express";
import {
  queryUsers,
  getUserByEmail,
  getUserById,
  addUser,
  deleteUser,
  getUsersNonAdmins,
  getVeteransByVolunteer,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/users", queryUsers);

router.get("/users/email/:email", getUserByEmail);

router.get("/users/id/:id", getUserById);

router.get("/nonAdminUsers", getUsersNonAdmins);

router.get("/veterans/:volunteerId", getVeteransByVolunteer);

router.post("/users", addUser);

router.delete("/users/:email", deleteUser);

export default router;
