import { APIResult, get, handleAPIError } from "./requests";

export type User = {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  assignedPrograms: string[];
  assignedVeterans: string[];
};

export async function getUserByEmail(email: string): Promise<APIResult<User>> {
  try {
    const response = await get(`/api/users/${email}`);
    const user = (await response.json()) as User;
    return { success: true, data: user };
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function getNonAdminUsers(program?: string): Promise<APIResult<User[]>> {
  try {
    const response = program
      ? await get(`/api/nonAdminUsers?assignedProgram=${program}`)
      : await get(`/api/nonAdminUsers`);
    const users = (await response.json()) as User[];
    return { success: true, data: users };
  } catch (error) {
    return handleAPIError(error);
  }
}
