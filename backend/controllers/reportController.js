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

    // Activity for report should be added to all admins and staff
    const adminUsers = await User.find({ role: "admin" }).select("_id").lean();
    const staffUsers = await User.find({ role: "staff" }).select("_id").lean();
    const adminIds = adminUsers.map((admin) => admin._id.toString());
    const staffIds = staffUsers.map((staff) => staff._id.toString());
    const receiverIds = [...adminIds, ...staffIds];

    const situationText = Array.isArray(situation) ? situation.join(", ") : situation;
    const activityDescription = `${situationText}. ${explanation}`;


    newActivity = await createActivity({
      uploader: reporterId,
      type: "report",
      description: activityDescription,
      receivers: receiverIds,
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

export const updateReportStatus = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { status } = req.body;
    const report = await Report.findByIdAndUpdate(
      reportId,
      { status },
      { new: true },
    );
    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }
    return res.status(200).json(report);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
