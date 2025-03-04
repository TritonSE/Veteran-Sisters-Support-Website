import { APIResult } from "./fileApi";
import { User } from "./users";

export type ActiveVolunteer = {
  assignedProgram: string;
  assignedVeteran: string;
  volunteer: string;
};

export const getVolunteersByProgram = async (program: string): Promise<APIResult<User[]>> => {
  try {
    const response = await fetch(`http://localhost:8080/api/users?assignedProgram=${program}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      return { success: false, error: response.statusText };
    }
    const data = (await response.json()) as User[];
    return { success: true, data };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
};

export const assignVolunteerToProgram = async (
  volunteerEmail: string,
  veteranEmail: string,
  program: string,
): Promise<APIResult<ActiveVolunteer>> => {
  try {
    const requestBodyVolunteer = {
      userEmail: volunteerEmail,
      veteranEmail,
      program,
    };

    // First fetch to add volunteer to activeVolunteer schema
    const response = await fetch(`http://localhost:8080/api/activeVolunteers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBodyVolunteer),
    });

    if (!response.ok) {
      console.log(response);
      return { success: false, error: response.statusText };
    }

    const data = (await response.json()) as ActiveVolunteer;

    // Second fetch to update assigned veterans on User schema
    const requestBodyVeteran = {
      veteranEmail,
    };

    const userResponse = await fetch(`http://localhost:8080/api/users/${volunteerEmail}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBodyVeteran),
    });

    if (!userResponse.ok) {
      return { success: false, error: userResponse.statusText };
    }

    return { success: true, data };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
};
