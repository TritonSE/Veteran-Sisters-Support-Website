import Report from "../models/reportModel.js";
import mongoose from "mongoose";

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
      statusResolved: false,
    });
    res.status(201).json(newReport);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
