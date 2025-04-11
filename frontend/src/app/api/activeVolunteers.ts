import { APIResult } from "./fileApi";
import { Role, UserProfile } from "./profileApi";

export type ActiveVolunteer = {
  assignedProgram: string;
  assignedVeteran: string;
  volunteer: string;
  volunteerUser: UserProfile;
  veteranUser: UserProfile;
};

export const getVeteransByProgram = async (
  program: string,
): Promise<APIResult<UserProfile[]>> => {
  try {
    const response = await fetch(`http://localhost:4000/api/users?role=veteran&assignedProgram=${program}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      return { success: false, error: response.statusText };
    }
    const data = (await response.json()) as UserProfile[];
    return { success: true, data };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
}

export const getVolunteersByProgram = async (
  program: string,
): Promise<APIResult<UserProfile[]>> => {
  try {
    const response = await fetch(`http://localhost:4000/api/users?assignedProgram=${program}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      return { success: false, error: response.statusText };
    }
    const data = (await response.json()) as UserProfile[];
    return { success: true, data };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
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

    // First fetch to add volunteer to activeVolunteer schema
    const response = await fetch(`http://localhost:4000/api/activeVolunteers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBodyVolunteer),
    });
    console.log(requestBodyVolunteer)

    if (!response.ok) {
      console.log(response);
      return { success: false, error: response.statusText };
    }

    const data = (await response.json()) as ActiveVolunteer;

    // Second fetch to update assigned veterans on User schema
    const requestBodyVeteran = {
      veteranEmail,
    };

    const userResponse = await fetch(`http://localhost:4000/api/users/${volunteerEmail}`, {
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

    // First fetch to remove volunteer to activeVolunteer schema
    const response = await fetch(`http://localhost:4000/api/activeVolunteers/${volunteerEmail}`, {
      method: "DELETE",
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

    const userResponse = await fetch(`http://localhost:4000/api/users/${volunteerEmail}`, {
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

export const getAssignedUsers = async (
  user: UserProfile
): Promise<APIResult<ActiveVolunteer[]>> => {
  try {
    //fetch volunteers if user is veteran and vice versa
    const query = `?${user.role === Role.VETERAN? `veteran=${user.email}` : `volunteer=${user.email}`}`;
    const response = await fetch(
      `http://localhost:4000/api/activeVolunteers${query}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    if (!response.ok) {
      return { success: false, error: response.statusText };
    }
    const data = (await response.json()) as ActiveVolunteer[];
    return { success: true, data };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
};
