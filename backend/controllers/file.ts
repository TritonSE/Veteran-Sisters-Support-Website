import { RequestHandler } from "express";

import FileObjectModel from "../models/file";

type FileUploadBody = {
  filename: string;
  permissions: string;
  comments: string;
  programs: string[];
};

export const uploadFile: RequestHandler = async (req, res, next) => {
  const { filename, permissions, comments, programs } = req.body as FileUploadBody;

  try {
    const fileObject = await FileObjectModel.create({
      filename,
      permissions,
      comments,
      programs,
    });

    res.status(201).json(fileObject);
  } catch (error) {
    next(error);
  }
};
