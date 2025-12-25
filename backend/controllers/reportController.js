import { Report } from "../models/reportModel.js";
import { User } from "../models/userModel.js";
import Activity from "../models/activityModel.js";
import { createActivity } from "./activityController.js";

// Clean up activity in case of failure
const cleanupActivity = async (activity) => {
  if (!activity) return;
  try {
    await Activity.findByIdAndDelete(activity._id);
    if (activity.receivers?.length > 0) {
      await User.updateMany(
        { _id: { $in: activity.receivers } },
        { $pull: { unreadActivities: activity._id.toString() } },
      );
    }
  } catch (error) {
    console.error("Error deleting activity after failure:", error);
  }
};

// Clean up report in case of failure
const cleanupReport = async (report) => {
  if (!report) return;
  try {
    await Report.findByIdAndDelete(report._id);
  } catch (error) {
    console.error("Error deleting report after failure:", error);
  }
};

export const addReport = async (req, res) => {
  let newReport = null;
  let newActivity = null;
  try {
    const { reporterId, reporteeId, situation, proofOfLifeDate, proofOfLifeTime, explanation } =
      req.body;
    newReport = await Report.create({
      reporterId,
      reporteeId,
      situation,
      proofOfLifeDate,
      proofOfLifeTime,
      explanation,
      datePosted: new Date(Date.now()),
      status: "Pending",
    });

    // Acitvity for report should be added to all admins
    const adminUsers = await User.find({ role: "admin" }).select("_id").lean();
    const adminIds = adminUsers.map((admin) => admin._id.toString());

    const situationText = Array.isArray(situation) ? situation.join(", ") : situation;
    const activityDescription = `${situationText}. ${explanation}`;

    // Create the activity with admins as receivers
    newActivity = await createActivity({
      uploader: reporterId,
      type: "report",
      description: activityDescription,
      receivers: adminIds,
      reportId: newReport._id,
    });

    res.status(201).json(newReport);
  } catch (error) {
    // If either creation failed, clean up both to ensure atomicity
    await Promise.all([cleanupActivity(newActivity), cleanupReport(newReport)]);
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getReportsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const reports = await Report.find({ reporterId: userId }).sort({ datePosted: -1 });
    return res.status(200).json(reports);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
