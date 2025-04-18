import { Role, UserProfile } from "./profileApi";
import { APIResult, del, get, handleAPIError, post, put } from "./requests"; // Update path as needed

export type ActiveVolunteer = {
  assignedProgram: string;
  assignedVeteran: string;
  volunteer: string;
  volunteerUser: UserProfile;
  veteranUser: UserProfile;
};

export const getVeteransByProgram = async (program: string): Promise<APIResult<UserProfile[]>> => {
  try {
    const response = await get(`/users?role=veteran&assignedProgram=${program}`);
    if (!response.ok) {
      return { success: false, error: response.statusText };
    }
    const data = (await response.json()) as UserProfile[];
    return { success: true, data };
  } catch (error: unknown) {
    return handleAPIError(error);
  }
};

export const getVolunteersByProgram = async (
  program: string,
): Promise<APIResult<UserProfile[]>> => {
  try {
    const response = await get(`/users?assignedProgram=${program}&role=staff&role=volunteer`);
    if (!response.ok) {
      return { success: false, error: response.statusText };
    }
    const data = (await response.json()) as UserProfile[];
    return { success: true, data };
  } catch (error) {
    return handleAPIError(error);
  }
};

export const assignUserToProgram = async (
  volunteerEmail: string,
  veteranEmail: string,
  program: string,
  volunteerId: string,
  veteranId: string,
): Promise<APIResult<ActiveVolunteer>> => {
  try {
    const requestBodyVolunteer = {
      userEmail: volunteerEmail,
      veteranEmail,
      program,
      volunteerId,
      veteranId,
    };

    // First request to add volunteer to activeVolunteer schema
    const response = await post("/activeVolunteers", requestBodyVolunteer);
    if (!response.ok) {
      return handleAPIError(response);
    }
    const data = (await response.json()) as ActiveVolunteer;

    // Second request to update assigned veterans on User schema
    const requestBodyVeteran = {
      veteranEmail,
    };

    const userResponse = await put(`/users/${volunteerEmail}`, requestBodyVeteran);
    if (!userResponse.ok) {
      return handleAPIError(userResponse);
    }

    return { success: true, data };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
};

export const removeVolunteerFromVeteran = async (
  volunteerEmail: string,
  veteranEmail: string,
  program: string,
): Promise<APIResult<ActiveVolunteer>> => {
  try {
    const requestBodyVolunteer = {
      veteranEmail,
      program,
    };

    // First request to remove volunteer from activeVolunteer schema
    const response = await del(`/activeVolunteers/${volunteerEmail}`, requestBodyVolunteer);
    if (!response.ok) {
      return handleAPIError(response);
    }
    const data = (await response.json()) as ActiveVolunteer;

    // Second request to update assigned veterans on User schema
    const requestBodyVeteran = {
      veteranEmail,
    };

    const userResponse = await put(`/users/${volunteerEmail}`, requestBodyVeteran);
    if (!userResponse.ok) {
      return handleAPIError(userResponse);
    }

    return { success: true, data };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
};

export const getAssignedUsers = async (
  user: UserProfile,
): Promise<APIResult<ActiveVolunteer[]>> => {
  try {
    //fetch volunteers if user is veteran and vice versa
    const query = `?${user.role === Role.VETERAN ? `veteran=${user.email}` : `volunteer=${user.email}`}`;
    const response = await get(`/activeVolunteers${query}`);
    if (!response.ok) {
      return handleAPIError(response);
    }
    const data = (await response.json()) as ActiveVolunteer[];
    return { success: true, data };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
};
