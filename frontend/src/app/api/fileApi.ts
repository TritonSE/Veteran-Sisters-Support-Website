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

export type APIResult<T> = { success: true; data: T } | { success: false; error: string };

export const createFileObject = async (
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
    if (!response.ok) {
      return { success: false, error: response.statusText };
    }
    const data = (await response.json()) as FileObject;
    console.log("Data: ", data);
    return { success: true, data };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
};

export const getFilesByUploader = async (uploader: string): Promise<APIResult<FileObject[]>> => {
  try {
    const response = await fetch(`http://localhost:4000/api/files/${uploader}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      return { success: false, error: response.statusText };
    }
    const data = (await response.json()) as FileObject[];
    return { success: true, data };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
};
