import { RequestHandler } from "express";
import FileObjectModel from "../models/file";


export const uploadFile: RequestHandler = async (req, res, next) => {
  const { filename, permissions, comments, programs } = req.body;

  try {
    const fileObject = await FileObjectModel.create({
      filename: filename,
      permissions: permissions,
      comments: comments,
      programs: programs
    });

    res.status(201).json(fileObject);
  } catch (error) {
    next(error);
  }
};