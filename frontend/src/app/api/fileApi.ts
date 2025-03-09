import { APIResult, get, handleAPIError, post } from "./requests";

export type FileObject = {
  _id: string;
  filename: string;
  uploader: string;
  comments: string[];
  programs: string[];
};

export type CreateFileObjectRequest = {
  filename: string;
  uploader: string;
  comments: string[];
  programs: string[];
};

export async function createFileObject(
  fileObject: CreateFileObjectRequest,
): Promise<APIResult<FileObject>> {
  try {
    const response = await post("/file", fileObject);
    const data = (await response.json()) as FileObject;
    console.log("Data: ", data);
    return { success: true, data };
  } catch (error: unknown) {
    return handleAPIError(error);
  }
}

export async function getFilesByUploader(uploader: string): Promise<APIResult<FileObject[]>> {
  try {
    const response = await get(`/files/${uploader}`);
    const data = (await response.json()) as FileObject[];
    return { success: true, data };
  } catch (error: unknown) {
    return handleAPIError(error);
  }
}
