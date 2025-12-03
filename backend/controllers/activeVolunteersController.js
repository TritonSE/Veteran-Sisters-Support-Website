import { ActiveVolunteers } from "../models/activeVolunteers.js";
import { createAssignment } from "./activityController.js";

//query active volunteers by program, veteran, or get all active volunteers
export const queryActiveVolunteersVeteranByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    let query = { assignedVeteran: email };

    const filteredVolunteers = await ActiveVolunteers.find(query)
      .populate("volunteerUser", "firstName lastName email")
      .populate("veteranUser", "firstName lastName email")
      .exec();

    res.json(filteredVolunteers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const queryActiveVolunteersVolunteerByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    let query = { volunteer: email };

    const filteredVolunteers = await ActiveVolunteers.find(query)
      .populate("volunteerUser", "firstName lastName email")
      .populate("veteranUser", "firstName lastName email")
      .exec();

    res.json(filteredVolunteers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//add a volunteer using their user email, program, and assigned veteran email
export const addVolunteer = async (req, res) => {
  try {
    const { userEmail, program, veteranEmail, volunteerId, veteranId } = req.body;

    const existingVolunteer = await ActiveVolunteers.findOne({
      volunteer: userEmail,
      assignedProgram: program,
      assignedVeteran: veteranEmail,
      volunteerUser: volunteerId,
      veteranUser: veteranId,
    }).exec();

    if (existingVolunteer) {
      return res
        .status(400)
        .json({ error: "This volunteer is already assigned to this program and veteran." });
    }

    const newVolunteer = await ActiveVolunteers.create({
      volunteer: userEmail,
      assignedProgram: program,
      assignedVeteran: veteranEmail,
      volunteerUser: volunteerId,
      veteranUser: veteranId,
    });

    await createAssignment({
      uploader: req.user.userId,
      veteranId: veteranId,
      volunteerId: volunteerId,
    });
    const { User } = await import("../models/userModel.js");

    const volunteer = await User.findById(volunteerId).exec();
    const veteran = await User.findById(veteranId).exec();

    if (volunteer) {
      if (!volunteer.assignedUsers) {
        volunteer.assignedUsers = [];
      }
      if (!volunteer.assignedUsers.includes(veteranEmail)) {
        volunteer.assignedUsers.push(veteranEmail);
        await volunteer.save({ validateBeforeSave: false });
      }
    }

    if (veteran) {
      if (!veteran.assignedUsers) {
        veteran.assignedUsers = [];
      }
      if (!veteran.assignedUsers.includes(userEmail)) {
        veteran.assignedUsers.push(userEmail);
        await veteran.save({ validateBeforeSave: false });
      }
    }

    res.status(201).json(newVolunteer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// delete a volunteer using their user email, program, or veteran email
export const removeVolunteer = async (req, res) => {
  try {
    const id = req.params.id;
    const { program, veteranEmail } = req.body;

    const volunteerEntry = await ActiveVolunteers.findOne({
      volunteer: id,
      ...(program && { assignedProgram: program }),
      ...(veteranEmail && { assignedVeteran: veteranEmail }),
    }).exec();

    if (!volunteerEntry) {
      return res.status(404).json({ error: "Volunteer assignment not found" });
    }

    const { User } = await import("../models/userModel.js");

    const deletedVeteranEmail = volunteerEntry.assignedVeteran;
    const deletedVolunteerEmail = volunteerEntry.volunteer;

    // If no specific program or veteran is provided, delete all assignments of the volunteer
    if (!program && !veteranEmail) {
      await ActiveVolunteers.deleteMany({ volunteer: id }).exec();
      return res.status(200).json({ message: "All volunteer assignments removed" });
    }

    await ActiveVolunteers.deleteOne({ _id: volunteerEntry._id }).exec();

    const volunteer = await User.findById(volunteerEntry.volunteerUser).exec();
    const veteran = await User.findById(volunteerEntry.veteranUser).exec();

    if (volunteer && veteran) {
      const remainingAssignments = await ActiveVolunteers.findOne({
        volunteer: deletedVolunteerEmail,
        assignedVeteran: deletedVeteranEmail,
      }).exec();

      if (!remainingAssignments) {
        if (volunteer.assignedUsers && volunteer.assignedUsers.includes(deletedVeteranEmail)) {
          volunteer.assignedUsers = volunteer.assignedUsers.filter(
            (email) => email !== deletedVeteranEmail,
          );
          await volunteer.save({ validateBeforeSave: false });
        }

        if (veteran.assignedUsers && veteran.assignedUsers.includes(deletedVolunteerEmail)) {
          veteran.assignedUsers = veteran.assignedUsers.filter(
            (email) => email !== deletedVolunteerEmail,
          );
          await veteran.save({ validateBeforeSave: false });
        }
      }
    }

    return res.status(200).json({ message: "Volunteer assignment removed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
