import express from "express";
import { queryUsers, getUserByEmail, addUser, deleteUser } from "../controllers/userController.js";

console.log("Request received at /api/users");

const router = express.Router();

router.get("/users", queryUsers);

router.get("/users/:email", getUserByEmail);

router.post("/users", addUser);

router.delete("/users/:email", deleteUser);

export default router;
