import express from "express";
import {
  queryUsers,
  getUserByEmail,
  addUser,
  deleteUser,
  updateUser,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/users", queryUsers);

router.get("/users/:email", getUserByEmail);

router.post("/users", addUser);

router.delete("/users/:email", deleteUser);

router.put("/users/:email", updateUser);

export default router;
