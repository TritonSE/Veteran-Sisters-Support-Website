import express from "express";
import {
  queryUsers,
  getUserByEmail,
  addUser,
  deleteUser,
  getUserById,
  getUsersNonAdmins,
  getUserRole,
  updateUserID,
  getVeteransByVolunteer,
  updateUserEmail,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/users", queryUsers);

router.get("/users/email/:email", getUserByEmail);

router.get("/users/id/:id", getUserById);

router.get("/nonAdminUsers", getUsersNonAdmins);

router.get("/veterans/:volunteerId", getVeteransByVolunteer);

router.post("/users", addUser);

router.delete("/users/:email", deleteUser);

router.get("/users/role/:email", getUserRole);
router.patch("/users/id/:id", updateUserID);
router.put("/users/:email", updateUserEmail);

export default router;
