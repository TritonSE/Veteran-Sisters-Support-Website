import { Schema, model, Types } from "mongoose";

const fileSchema = new Schema({
  filename: { type: String, required: true },
  uploader: { type: Types.ObjectId, required: true, ref: "User" },
  comments: [{ type: Types.ObjectId, required: false, ref: "Comment" }],
  programs: [{ type: String, required: true }],
});

const FileObject = model("FileObject", fileSchema);

export default FileObject;
