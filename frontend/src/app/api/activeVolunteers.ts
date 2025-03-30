import { UserProfile } from "./profileApi";
import { APIResult, get, handleAPIError, post, put } from "./requests"; // Update path as needed

export type ActiveVolunteer = {
  assignedProgram: string;
  assignedVeteran: string;
  volunteer: string;
  volunteerUser: UserProfile;
};

export const getVolunteersByProgram = async (
  program: string,
): Promise<APIResult<UserProfile[]>> => {
  try {
    const response = await get(`/users?assignedProgram=${program}`);
    if (!response.ok) {
      return { success: false, error: response.statusText };
    }
    const data = (await response.json()) as UserProfile[];
    return { success: true, data };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
};

export const assignVolunteerToProgram = async (
  volunteerEmail: string,
  veteranEmail: string,
  program: string,
  volunteerId: string,
): Promise<APIResult<ActiveVolunteer>> => {
  try {
    const requestBodyVolunteer = {
      userEmail: volunteerEmail,
      veteranEmail,
      program,
      userId: volunteerId,
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
    const response = await fetch(`http://localhost:4000/api/activeVolunteers/${volunteerEmail}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBodyVolunteer),
    });
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

export const getVolunteersByVeteran = async (
  veteranEmail: string,
): Promise<APIResult<ActiveVolunteer[]>> => {
  try {
    const response = await get(`/activeVolunteers?veteran=${veteranEmail}`);
    if (!response.ok) {
      return handleAPIError(response);
    }
    const data = (await response.json()) as ActiveVolunteer[];
    return { success: true, data };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
};
