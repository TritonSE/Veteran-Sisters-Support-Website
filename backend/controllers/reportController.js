import { Report } from "../models/reportModel.js";

export const addReport = async (req, res) => {
  try {
    const { reporterId, reporteeId, situation, proofOfLifeDate, proofOfLifeTime, explanation } =
      req.body;
    const newReport = await Report.create({
      reporterId,
      reporteeId,
      situation,
      proofOfLifeDate,
      proofOfLifeTime,
      explanation,
      datePosted: new Date(Date.now()),
    });
    res.status(201).json(newReport);
  } catch (error) {
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
