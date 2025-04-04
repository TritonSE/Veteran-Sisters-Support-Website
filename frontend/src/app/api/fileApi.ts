import { APIResult, del, get, handleAPIError, post, put } from "./requests";
import { User } from "./userApi";

export type Comment = {
  _id: string;
  comment: string;
  commenterId: User;
  datePosted: string;
  edited?: boolean;
};

export type FileObject = {
  _id: string;
  filename: string;
  uploaderId: string;
  comments: Comment[];
  programs: string[];
};

export type CreateFileObjectRequest = {
  filename: string;
  uploaderId: string;
  comment: string;
  programs: string[];
};

export type EditFileObjectRequest = {
  filename?: string;
  uploader?: string;
  comments?: Comment[];
  programs?: string[];
};

export type CreateCommentRequest = {
  comment: string;
  commenterId: string;
};

export const createFileObject = async (
  fileObject: CreateFileObjectRequest,
): Promise<APIResult<FileObject>> => {
  try {
    const response = await post("/file", fileObject);
    if (!response.ok) {
      return handleAPIError(response);
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
    const response = await get(`/file/uploader/${uploader}`);
    if (!response.ok) {
      return handleAPIError(response);
    }
    const data = (await response.json()) as FileObject[];
    return { success: true, data };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
};

export const getFileById = async (id: string): Promise<APIResult<FileObject>> => {
  try {
    const response = await get(`/file/${id}`);
    if (!response.ok) {
      return handleAPIError(response);
    }
    const data = (await response.json()) as FileObject;
    return { success: true, data };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
};

export const createCommentObject = async (
  comment: CreateCommentRequest,
): Promise<APIResult<Comment>> => {
  try {
    const response = await post("/comments", comment);
    if (!response.ok) {
      return handleAPIError(response);
    }
    const data = (await response.json()) as Comment;
    console.log("Data: ", data);
    return { success: true, data };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
};

export const editFileObject = async (
  id: string,
  update: EditFileObjectRequest,
): Promise<APIResult<FileObject>> => {
  try {
    const response = await put(`/file/${id}`, update);
    if (!response.ok) {
      return handleAPIError(response);
    }
    const data = (await response.json()) as FileObject;
    console.log("Data: ", data);
    return { success: true, data };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
};

export const editCommentObject = async (
  id: string,
  newComment: string,
): Promise<APIResult<Comment>> => {
  try {
    const response = await put(`/comment/${id}`, { comment: newComment });
    if (!response.ok) {
      return handleAPIError(response);
    }
    const data = (await response.json()) as Comment;
    console.log("Data: ", data);
    return { success: true, data };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
};

export const deleteCommentObject = async (id: string): Promise<APIResult<void>> => {
  try {
    const response = await del(`/comment/${id}`);
    if (!response.ok) {
      return handleAPIError(response);
    }
    return { success: true, data: undefined };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
};
