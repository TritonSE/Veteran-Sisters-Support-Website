import { User } from "../models/userModel.js";
export const queryUsers = async (req, res) => {
  try {
    const { assignedProgram, ...userQuery } = req.query;
    const users = await User.find(userQuery).exec();
    // only return users that are assigned to assignedProgram
    const filteredUsers = assignedProgram
      ? users.filter((user) => user.assignedPrograms.includes(assignedProgram))
      : users;
    res.json(filteredUsers);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUserByEmail = async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({ email }).exec();
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "Could not find user" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const addUser = async (req, res) => {
  try {
    const { email, firstName, lastName, role, assignedPrograms, assignedVeteran } = req.body;
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
      res.status(409).json({ error: "User with that email already exists" });
    } else {
      const newUser = await User.create({
        email,
        firstName,
        lastName,
        role,
        assignedPrograms,
        assignedVeteran,
      });
      res.status(201).json(newUser);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteUser = async (req, res) => {
  const email = req.params.email;
  const deleteStatus = await User.deleteMany({ email }).exec();
  res.json(deleteStatus);
  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
