import express from "express";
import { User } from "../models/userModel.js";

const router = express.Router();

router.get("/users", (req, res) => {
  const role = req.query.role;

  res.send(`requesting all users with role=${role}`);
});

router.get("/users/:email", async (req, res) => {
  const email = req.params.email;
  const user = await User.findOne({ email }).exec();
  if (user) {
    res.send(user);
  } else {
    res.status(404).send(`Could not find user with email=${email}`);
  }
});

router.post("/users", async (req, res) => {
  const { email, firstName, lastName, role, assignedPrograms, assignedVeteran } = req.body;

  const existingUser = await User.findOne({ email }).exec();
  if (existingUser) {
    res.status(409).send(`User with email=${email} already exists`);
  } else {
    const newUser = await User.create({
      email,
      firstName,
      lastName,
      role,
      assignedPrograms,
      assignedVeteran,
    });
    res.send(`successfully added user with email=${email}`);
  }
});

router.delete("/users/:email", (req, res) => {
  res.send(`deleting user with email=${req.params.email}`);
});

export default router;
