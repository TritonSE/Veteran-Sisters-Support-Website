import { ActiveVolunteers } from "../models/activeVolunteers.js";

//query active volunteers by program, veteran, or get all active volunteers
export const queryActiveVolunteers = async (req, res) => {
  try {
    const { program, veteran } = req.query;
    let query = {};

    if (program) {
      query.assignedPrograms = program;
    }

    if (veteran) {
      query.assignedVeterans = veteran;
    }

    const filteredVolunteers = await ActiveVolunteers.find(query)
      .populate("volunteer", "firstName lastName email")
      .populate("assignedVeterans", "firstName lastName email")
      .exec();

    res.json(filteredVolunteers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//add a volunteer using their userID, program, and assigned veteranID
export const addVolunteer = async (req, res) => {
  try {
    const { userId, program, veteranId } = req.body;
    const existingUser = await ActiveVolunteers.findOne({ volunteer: userId }).exec();

    if (existingUser) {
      if (!existingUser.assignedPrograms.includes(program)) {
        existingUser.assignedPrograms.push(program);
      }

      if (!existingUser.assignedVeterans.includes(veteranId)) {
        existingUser.assignedVeterans.push(veteranId);
      }

      await existingUser.save();
      res.status(200).json(existingUser);
    } else {
      const newVolunteer = await ActiveVolunteers.create({
        volunteer: userId,
        assignedPrograms: [program],
        assignedVeterans: [veteranId],
      });
      res.status(201).json(newVolunteer);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//delete a volunteer using their userID, program, or veteranID
export const removeVolunteer = async (req, res) => {
  try {
    const id = req.params.id;
    const { program, veteran } = req.query;

    const volunteer = await ActiveVolunteers.findOne({ volunteer: id }).exec();

    // If no `program` or `veteran` is provided in the query, remove the entire volunteer
    if (!program && !veteran) {
      await ActiveVolunteers.deleteOne({ volunteer: id }).exec();
      return res.status(200).json({ message: "Volunteer removed" });
    }

    // If `program` is provided, remove it from `assignedPrograms`
    if (program) {
      volunteer.assignedPrograms = volunteer.assignedPrograms.filter((p) => p !== program);
    }

    // If `veteran` is provided, remove it from `assignedVeterans`
    if (veteran) {
      volunteer.assignedVeterans = volunteer.assignedVeterans.filter((v) => v !== veteran);
    }

    // If there are no assigned programs or veterans left, remove the entire volunteer
    if (volunteer.assignedPrograms.length === 0 && volunteer.assignedVeterans.length === 0) {
      await ActiveVolunteers.deleteOne({ volunteer: id }).exec();
      return res.status(200).json({ message: "Volunteer removed" });
    }
    await volunteer.save();

    res.status(200).json({ message: "Removed successfully", volunteer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
