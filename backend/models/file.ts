import { InferSchemaType, Schema, model } from "mongoose";

const fileSchema = new Schema({
  filename: { type: String, required: true },
  permissions: { type: [String], required: true },
  comments: { type: [String], required: true },
  programs: { type: [String], required: true },
});

type FileObject = InferSchemaType<typeof fileSchema>;

export default model<FileObject>("FileObject", fileSchema);
