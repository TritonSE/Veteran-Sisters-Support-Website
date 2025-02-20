import { APIResult, get, handleAPIError } from "./requests";

export type User = {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  assignedPrograms: string[];
  assignedVeterans: string[];
  assignedVolunteers: string[];
};

export async function getNonAdminUsers(program?: string): Promise<APIResult<User[]>> {
  try {
    const response = program
      ? await get(`/api/nonAdminUsers?assignedProgram=${program}`)
      : await get(`/api/nonAdminUsers`);
    if (!response.ok) {
      return { success: false, error: response.statusText };
    }
    const users = (await response.json()) as User[];
    return { success: true, data: users };
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function getVeteransByVolunteer(volunteerId: string): Promise<APIResult<User[]>> {
  try {
    const response = await get(`/api/veterans/${volunteerId}`);
    if (response.ok) {
      return { success: false, error: response.statusText };
    }
    const users = (await response.json()) as User[];
    return { success: true, data: users };
  } catch (error) {
    return handleAPIError(error);
  }
}
