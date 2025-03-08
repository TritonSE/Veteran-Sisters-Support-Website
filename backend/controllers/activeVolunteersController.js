import { ActiveVolunteers } from "../models/activeVolunteers.js";

//query active volunteers by program, veteran, or get all active volunteers
export const queryActiveVolunteers = async (req, res) => {
  try {
    const { program, veteran } = req.query;
    let query = {};

    if (program) {
      const programsArray = program.split(",").map((p) => p.trim());
      query.assignedProgram = { $in: programsArray };
    }

    if (veteran) {
      query.assignedVeteran = veteran;
    }

    const filteredVolunteers = await ActiveVolunteers.find(query)
      .populate("volunteer", "firstName lastName email")
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
    const { userEmail, program, veteranEmail } = req.body;

    const existingVolunteer = await ActiveVolunteers.findOne({
      volunteer: userEmail,
      assignedProgram: program,
      assignedVeteran: veteranEmail,
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
    });

    res.status(201).json(newVolunteer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//delete a volunteer using their user email, program, or veteran email
export const removeVolunteer = async (req, res) => {
  try {
    const id = req.params.id;
    const { program, veteran } = req.query;

    const volunteerEntry = await ActiveVolunteers.findOne({
      volunteer: id,
      ...(program && { assignedProgram: program }),
      ...(veteran && { assignedVeteran: veteran }),
    }).exec();

    if (!volunteerEntry) {
      return res.status(404).json({ error: "Volunteer assignment not found" });
    }

    // If no specific program or veteran is provided, delete all assignments of the volunteer
    if (!program && !veteran) {
      await ActiveVolunteers.deleteMany({ volunteer: id }).exec();
      return res.status(200).json({ message: "All volunteer assignments removed" });
    }

    // If a specific entry is found, delete it
    await ActiveVolunteers.deleteOne({ _id: volunteerEntry._id }).exec();

    return res.status(200).json({ message: "Volunteer assignment removed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
