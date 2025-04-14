import { APIResult, get, handleAPIError, post } from "./requests";

export type CreateUserRequest = {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  phoneNumber: string;
  zipCode: number;
  address: {
    streetAddress1: string;
    streetAddress2: string;
    city: string;
    state: string;
  };
  roleSpecificInfo: {
    serviceInfo: {
      dateServiceEnded: Date;
      branchOfService: string;
      currentMilitaryStatus: string;
      gender: string;
    };
    interests: string[];
    assignedPrograms: string[];
  };
  assignedVeterans?: string[];
};

export type User = {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  assignedPrograms: string[];
  assignedUsers: string[];
  yearJoined?: number;
  age?: number;
  gender?: string;
  phoneNumber?: string;
};

export const createUser = async (
  fileObject: CreateUserRequest,
): Promise<APIResult<CreateUserRequest>> => {
  try {
    const response = await post("/users", fileObject);
    if (!response.ok) {
      return handleAPIError(response);
    }
    const data = (await response.json()) as CreateUserRequest;
    return { success: true, data };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
};

export async function getUser(userId: string): Promise<APIResult<User>> {
  try {
    const response = await get(`/users/id/${userId}`);
    if (!response.ok) {
      return handleAPIError(response);
    }
    const data = (await response.json()) as User;
    return { success: true, data };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
}

export async function getNonAdminUsers(program?: string): Promise<APIResult<User[]>> {
  try {
    const response = program
      ? await get(`/nonAdminUsers?assignedProgram=${program}`)
      : await get(`/nonAdminUsers`);
    if (!response.ok) {
      return handleAPIError(response);
    }
    const users = (await response.json()) as User[];
    return { success: true, data: users };
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function getVeteransByVolunteer(volunteerId: string): Promise<APIResult<User[]>> {
  try {
    const response = await get(`/veterans/${volunteerId}`);
    if (!response.ok) {
      return handleAPIError(response);
    }
    const users = (await response.json()) as User[];
    return { success: true, data: users };
  } catch (error) {
    return handleAPIError(error);
  }
}

export default createUser;
