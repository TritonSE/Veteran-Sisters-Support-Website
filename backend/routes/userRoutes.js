import express from "express";
import { User } from "../models/userModel.js";

const router = express.Router();

router.get("/users", async (req, res) => {
  const { assignedProgram, ...userQuery } = req.query;
  const users = await User.find(userQuery).exec();
  // only return users that are assigned to assignedProgram
  const filteredUsers = assignedProgram
    ? users.filter((user) => user.assignedPrograms.includes(assignedProgram))
    : users;
  res.send(filteredUsers);
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
    await User.create({
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

router.delete("/users/:email", async (req, res) => {
  const email = req.params.email;
  const deleteStatus = await User.deleteMany({ email }).exec();
  res.send(deleteStatus);
});

export default router;
