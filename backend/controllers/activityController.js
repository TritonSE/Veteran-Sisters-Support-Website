import Activity from "../models/activityModel.js";
import { User } from "../models/userModel.js";
import { ActiveVolunteers } from "../models/activeVolunteers.js";

export const getActivity = async (req, res) => {
  try {
    const { activityId } = req.params;
    const activity = await Activity.findById(activityId)
      .populate("uploader", "firstName lastName role email phoneNumber")
      .populate(
        "assignmentInfo.volunteerId",
        "_id firstName lastName email phoneNumber assignedPrograms",
      )
      .populate(
        "assignmentInfo.veteranId",
        "_id firstName lastName email phoneNumber assignedPrograms",
      );
    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }
    res.status(200).json(activity);
  } catch (error) {
    res.status(500).json({ message: "Error fetching activity", error: error.message });
  }
};

export const getActivities = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let activities;
    if (user.role == "admin") {
      activities = await Activity.find({
        $or: [
          { receivers: user._id.toString() },
          { type: "announcement" },
          { type: "report" },
          { type: "signup" },
        ],
      })
        .populate("uploader", "firstName lastName role email phoneNumber")
        .populate("assignmentInfo.volunteerId", "firstName lastName")
        .populate("assignmentInfo.veteranId", "firstName lastName")
        .sort({ createdAt: -1 })
        .lean();
    } else if (user.role == "staff") {
      activities = await Activity.find({
        $or: [
          { receivers: user._id.toString() },
          { type: "announcement" },
          { type: "request" },
          { type: "signup" },
          { programName: { $in: user.assignedPrograms } },
        ],
      })
        .populate("uploader", "firstName lastName role email phoneNumber")
        .populate("assignmentInfo.volunteerId", "firstName lastName")
        .populate("assignmentInfo.veteranId", "firstName lastName")
        .sort({ createdAt: -1 })
        .lean();
    } else {
      activities = await Activity.find({
        $or: [{ receivers: user._id.toString() }, { type: "announcement" }],
      })
        .populate("uploader", "firstName lastName role email phoneNumber")
        .populate("assignmentInfo.volunteerId", "firstName lastName")
        .populate("assignmentInfo.veteranId", "firstName lastName")
        .sort({ createdAt: -1 })
        .lean();
    }
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: "Error fetching activities", error: error.message });
  }
};

// Return a. Recent 3 unread activities, b. Total count of unread activities
export const getUnreadActivities = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const announcements = await Activity.find({
      _id: { $in: user.unreadActivities },
      type: "announcement",
    })
      .populate("uploader", "firstName lastName role email phoneNumber")
      .sort({ createdAt: -1 })
      .lean();

    const otherActivities = await Activity.find({
      _id: { $in: user.unreadActivities },
      type: { $ne: "announcement" },
    })
      .populate("uploader", "firstName lastName role email phoneNumber")
      .populate("assignmentInfo.volunteerId", "firstName lastName")
      .populate("assignmentInfo.veteranId", "firstName lastName")
      .sort({ createdAt: -1 })
      .lean();

    const totalUnreadCount = announcements.length + otherActivities.length;
    const activities = [...announcements, ...otherActivities].slice(0, 3);

    res.status(200).json({
      recentUnread: activities,
      totalUnread: totalUnreadCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching unread activities", error: error.message });
  }
};

export const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Activity.find({ type: "announcement" }).sort({ createdAt: -1 });
    res.status(200).json(announcements);
  } catch (error) {
    res.status(500).json({ message: "Error getting announcements", error: error.message });
  }
};

// Helper function: Create new activity
export const createActivity = async (activityData) => {
  try {
    const {
      uploader,
      type,
      receivers,
      title,
      description,
      documentName,
      documentId,
      programName,
      assignmentInfo,
    } = activityData;

    if (!uploader || !type) {
      return res.status(400).json({ message: "Uploader ID, and type are required" });
    }

    if (["document", "comment", "request"].includes(type) && (!documentName || !documentId)) {
      return res.status(400).json({
        message:
          "documentName and documentId are required for Document, Comment, and Request types",
      });
    }

    if (type === "document" && !programName) {
      return res.status(400).json({ message: "programName is required for Document type" });
    }

    if (["report", "announcement", "comment"].includes(type) && !description) {
      return res
        .status(400)
        .json({ message: "description is required for Report, Announcement, and Comment type" });
    }

    if (type === "announcement" && !title) {
      return res.status(400).json({ message: "title is required for Announcement type" });
    }

    // // Find uploader's user details
    const user = await User.findById(uploader);
    if (!user) {
      return res.status(404).json({ message: "Uploader not found" });
    }

    const newActivity = new Activity({
      uploader: uploader,
      type,
      receivers,
      title,
      description,
      documentName,
      documentId,
      programName,
      assignmentInfo,
      createdAt: new Date(),
      type,
    });
    const savedActivity = await newActivity.save();
    if (!!receivers) {
      await User.updateMany(
        { _id: { $in: receivers } },
        { $push: { unreadActivities: savedActivity._id.toString() } },
      );
    }
    return savedActivity;
    // res.status(201).json(newActivity);
  } catch (error) {
    throw new Error("Error creating activity: " + error.message);
  }
};

// Create activity type "document" by calling createActivity
export const createDocument = async ({ uploader, documentName, documentId, programs }) => {
  try {
    // Create unread activity
    const lowercasePrograms = programs.map((program) => {
      if (program === "BattleBuddies") return "battle buddies";
      else if (program === "Advocacy") return "advocacy";
      else if (program === "OperationWellness") return "operation wellness";
      else return program;
    });
    const activeVolunteer = await ActiveVolunteers.find({
      veteranUser: uploader,
      assignedProgram: { $in: lowercasePrograms },
    });
    const receivers = activeVolunteer.map((item) => item.volunteerUser.toString());

    const newActivity = {
      uploader,
      type: "document",
      receivers: receivers,
      documentName: documentName,
      documentId: documentId,
      programName: lowercasePrograms,
    };

    const savedActivity = await createActivity(newActivity);
    return savedActivity;
  } catch (error) {
    throw new Error("Error creating Document activity: " + error.message);
  }
};

// Create activity type "announcement" by calling createActivity
export const createAnnouncement = async (req, res) => {
  try {
    const { uploader, title, description } = req.body;
    const newActivity = {
      uploader,
      type: "announcement",
      title,
      description,
    };

    const savedActivity = await createActivity(newActivity);
    await User.updateMany({}, { $push: { unreadActivities: savedActivity._id.toString() } });
    res.status(201).json(savedActivity);
  } catch (error) {
    res.status(500).json({ message: "Error creating Announcement activity", error: error.message });
  }
};

// Create activity type "comment" by calling createActivity
export const createComment = async ({ comment, documentName, documentId, documentUploader }) => {
  try {
    const newActivity = {
      uploader: comment.commenterId,
      type: "comment",
      receivers: [documentUploader],
      documentName,
      documentId,
      description: comment.comment,
    };

    const savedActivity = await createActivity(newActivity);
    return savedActivity;
  } catch (error) {
    throw new Error("Error creating Comment activity: " + error.message);
  }
};

// Create activity type "assignment" by calling createActivity
export const createAssignment = async ({ uploader, veteranId, volunteerId }) => {
  try {
    const newActivity = {
      uploader,
      type: "assignment",
      receivers: [veteranId, volunteerId],
      assignmentInfo: {
        veteranId: veteranId,
        volunteerId: volunteerId,
      },
    };

    const savedActivity = await createActivity(newActivity);
    return savedActivity;
  } catch (error) {
    throw new Error("Error creating Assignment activity: " + error.message);
  }
};

// Create activity type "report" by calling createActivity
export const createReport = async ({ uploader, description }) => {
  try {
    const newActivity = {
      uploader,
      type: "report",
      description,
    };

    const savedActivity = await createActivity(newActivity);
    return savedActivity;
  } catch (error) {
    throw new Error("Error creating Report activity: " + error.message);
  }
};

// Create activity type "request" by calling createActivity
export const createRequest = async ({ uploader, documentName, documentId }) => {
  try {
    const newActivity = {
      uploader,
      type: "request",
      documentName,
      documentId,
    };

    const savedActivity = await createActivity(newActivity);
    return savedActivity;
  } catch (error) {
    throw new Error("Error creating Request activity: " + error.message);
  }
};
