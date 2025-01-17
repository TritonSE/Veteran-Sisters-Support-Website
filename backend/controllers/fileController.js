import FileObject from "../models/fileModel.js";

export const uploadFile = async (req, res, next) => {
  const { filename, uploader, permissions, comments, programs } = req.body;

  try {
    const fileObject = await FileObject.create({
      filename,
      uploader,
      permissions,
      comments,
      programs,
    });

    res.status(201).json(fileObject);
  } catch (error) {
    next(error);
  }
};
