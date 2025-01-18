export type FileObject = {
  _id: string;
  filename: string;
  uploader: string;
  comments: string[];
  programs: string[];
};

type FileObjectJSON = {
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

const parseFileObject = (fileObj: FileObjectJSON): FileObject => {
  return {
    _id: fileObj._id,
    uploader: fileObj.uploader,
    filename: fileObj.filename,
    comments: fileObj.comments,
    programs: fileObj.programs,
  };
};

export type APIResult<T> = { success: true; data: T } | { success: false; error: string };

const createFileObject = async (
  fileObject: CreateFileObjectRequest,
): Promise<APIResult<FileObject>> => {
  try {
    const response = await fetch("http://localhost:4000/api/file", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fileObject),
    });
    const data = (await response.json()) as FileObjectJSON;
    console.log("Data: ", data);
    return { success: true, data: parseFileObject(data) };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
};

export default createFileObject;
