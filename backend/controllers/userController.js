import { User } from "../models/userModel.js";
import mongoose from "mongoose";
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

export const doesUserEmailExist = async (req, res) => {
  try {
    const email = req.params.email;
    const userExists = await User.exists({ email });
    res.json({ exists: !!userExists });
  } catch (error) {
    console.error("doesUserEmailExist Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).exec();
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
      firstName,
      lastName,
      role,
      yearJoined,
      age,
      gender,
      phoneNumber,
      zipCode,
      address,
      roleSpecificInfo,
      assignedPrograms,
      assignedUsers,
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
        assignedUsers,
        unreadActivities: [],
      });
      res.status(201).json(newUser);
    }
  } catch (error) {
    console.log("addUser Error", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteUser = async (req, res) => {
  const userId = req.params.userId;
  const deleteStatus = await User.deleteMany({ _id: userId }).exec();
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

export const getUserRole = async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({ email }).exec();
    if (user) {
      res.json({ role: user.role });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("getUserRole Error:", error);
  }
};

export const updateUser = async (req, res) => {
  try {
    const email = req.params.email;
    const { program, veteranEmail } = req.body;

    const user = await User.findOne({ email }).exec();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (program) {
      const programIndex = user.assignedPrograms.indexOf(program);
      if (programIndex > -1) {
        user.assignedPrograms.splice(programIndex, 1);
      } else {
        user.assignedPrograms.push(program);
      }
    }

    if (veteranEmail) {
      //updates assignedUsers on both users involved
      const veteran = await User.findOne({ email: veteranEmail }).exec();
      if (!veteran) {
        return res.status(404).json({ error: "Veteran not found" });
      }
      const userIndex = veteran.assignedUsers.indexOf(email);
      const veteranIndex = user.assignedUsers.indexOf(veteranEmail);
            
      if (veteranIndex > -1) {
        user.assignedUsers.splice(veteranIndex, 1);
      } else {
        user.assignedUsers.push(veteranEmail);
      }

      if (userIndex > -1) {
        veteran.assignedUsers.splice(userIndex, 1);
      } else {
        veteran.assignedUsers.push(email);
      }

      await veteran.save();
    }

    await user.save();

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getVeteransByVolunteer = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    const users = await User.find({ email: { $in: user.assignedUsers } }).sort({
      firstName: "asc",
    });

    if (users) {
      res.status(200).json(users);
    } else {
      res.status(404).json({ error: "Could not find users" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getVolunteersByProgram = async (req, res) => {
  try {
    const { program } = req.params;
    const users = await User.find({ assignedPrograms: program, role: "volunteer" }).exec();
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export const getVeteransByProgram = async (req, res) => {
  try {
    const { program } = req.params;
    const users = await User.find({ assignedPrograms: program, role: "veteran" }).exec();
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}


export const updateUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const { firstName, lastName, email, phoneNumber, age, gender } = req.body;

    const update = {
      firstName,
      lastName,
      email,
      phoneNumber,
      age,
      roleSpecificInfo: {
        serviceInfo: {
          gender,
        },
      },
    };

    const updatedUser = await User.findByIdAndUpdate(userId, update, {
      new: true,
      runValidators: true,
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Mark activity as read
export const markActivityRead = async (req, res) => {
  try {
    const userId = req.params.id;
    const { activityId } = req.body;
    const updatedUser = await User.findByIdAndUpdate(userId, {
      $pull: { unreadActivities: activityId },
    });
    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error marking activity as read", error: error.message });
  }
};
