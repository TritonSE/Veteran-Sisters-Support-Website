import { User } from "../models/userModel.js";
export const queryUsers = async (req, res) => {
  try {
    const { assignedProgram, assignedVeteran, ...userQuery } = req.query;
    const users = await User.find(userQuery).exec();

    // if assignedProgram specified, only return users that are assigned to the assignedProgram
    const usersByAssignedProgram = assignedProgram
      ? users.filter((user) => user.assignedPrograms.includes(assignedProgram))
      : users;

    // if assignedVeteran specified, only return users that are assigned to the assignedVeteran
    const usersByAssignedVeteran = assignedVeteran
      ? usersByAssignedProgram.filter((user) => user.assignedVeterans.includes(assignedVeteran))
      : usersByAssignedProgram;

    res.json(usersByAssignedVeteran);
  } catch (error) {
    console.log("queryUser Error", error);
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
    console.log("getUserbyEmail Error", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).exec();
    if (!user) {
      return res.status(404).json({ error: "Could not find user" });
    }
    const userObject = user.toObject();
    const assignedUsers = await User.find({ email: { $in: user?.assignedUsers } });
    userObject.assignedUsers = assignedUsers.map((user) => user.toObject());
    res.json(userObject);
  } catch (error) {
    console.log("getUserbyEmail Error", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const addUser = async (req, res) => {
  try {
    const {
      email,
      phoneNumber,
      firstName,
      lastName,
      role,
      zipCode,
      address,
      roleSpecificInfo,
      assignedPrograms,
      assignedVeterans,
    } = req.body;
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
      res.status(409).json({ error: "User with that email already exists" });
    } else {
      const newUser = await User.create({
        email,
        phoneNumber,
        firstName,
        lastName,
        role,
        zipCode,
        address,
        roleSpecificInfo,
        assignedPrograms,
        assignedVeterans,
        assignedVolunteers: [],
      });
      res.status(201).json(newUser);
    }
  } catch (error) {
    console.log("addUser Error", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteUser = async (req, res) => {
  const email = req.params.email;
  const deleteStatus = await User.deleteMany({ email }).exec();
  res.json(deleteStatus);
  try {
  } catch (error) {
    console.log("deleteUser Error", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUsersNonAdmins = async (req, res) => {
  try {
    const { assignedProgram } = req.query;
    const users = await User.find({ role: { $ne: "admin" } }).exec();

    // if assignedProgram specified, only return users that are assigned to the assignedProgram
    const usersByAssignedProgram = assignedProgram
      ? users.filter((user) => user.assignedPrograms.includes(assignedProgram))
      : users;

    res.status(200).json(usersByAssignedProgram);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
