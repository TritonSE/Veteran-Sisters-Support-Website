import { APIResult, get, handleAPIError, patch, post } from "./requests";

export type ServiceInfo = {
  dateServiceEnded?: Date;
  branchOfService?: BranchOfService;
  currentMilitaryStatus?: CurrentMilitaryStatus;
  gender?: Gender;
};

export type RoleSpecificInfo = {
  serviceInfo?: ServiceInfo;
  interests?: string[];
};

export type UserProfile = {
  _id?: string;
  email: string;
  firstName: string;
  lastName: string;
  zipCode: number;
  assignedPrograms: AssignedProgram[] | undefined;
  yearJoined?: number;
  age?: number;
  roleSpecificInfo?: RoleSpecificInfo;
  gender?: string;
  phoneNumber?: string;
  role: Role | undefined;
  assignedUsers?: UserProfile[];
  veteransUnderPointOfContact?: Veteran[];
};

export type BranchOfService =
  | "Air Force"
  | "Army"
  | "Coast Guard"
  | "First Responder"
  | "Marine Corps"
  | "Navy"
  | "National Guard"
  | "Space Force"
  | "";

export type CurrentMilitaryStatus =
  | "Active Duty"
  | "Reservist"
  | "Veteran"
  | "Veteran Medically Retired"
  | "Veteran 20+ Years Retired"
  | "First Responder"
  | "";

export type Gender = "Female" | "Male" | "Other" | "";

export type Veteran = {
  firstName: string;
  lastName: string;
  email: string;
  assignedPrograms: AssignedProgram;
};

export enum AssignedProgram {
  BATTLE_BUDDIES = "battle buddies",
  ADVOCACY = "advocacy",
  OPERATION_WELLNESS = "operation wellness",
}

export enum Role {
  VETERAN = "veteran",
  VOLUNTEER = "volunteer",
  ADMIN = "admin",
  STAFF = "staff",
}

export type ProfileCommentRequest = {
  profileId: { firstName: string; lastName: string }; // profile ID of the user being commented on
  commenterId: { firstName: string; lastName: string }; // commenter id
  comment: string;
  datePosted: Date;
};

export type ProfileCommentPostRequest = {
  profileId: string;
  commenterId: string;
  comment: string;
  datePosted: Date;
};

export type ProfileComment = {
  user: string;
  datePosted: Date;
  comment: string;
};

function parseProfileComment(comment: ProfileCommentRequest[]): ProfileComment[] {
  return comment.map((c) => ({
    user: `${c.commenterId.firstName} ${c.commenterId.lastName}`,
    datePosted: c.datePosted,
    comment: c.comment,
  }));
}

export async function getUserProfile(userId: string): Promise<APIResult<UserProfile>> {
  try {
    const response = await get(`/users/id/${userId}`);
    if (!response.ok) {
      return handleAPIError(response);
    }
    const data = (await response.json()) as UserProfile;
    return { success: true, data };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
}

export const updateUserProfile = async (
  userId: string,
  firstName: string,
  lastName: string,
  phoneNumber: string,
  age: number,
  gender: Gender,
) => {
  try {
    const response = await patch(`/users/id/${userId}`, {
      firstName,
      lastName,
      phoneNumber,
      age,
      gender,
    });
    if (!response.ok) {
      return { success: false, error: response.statusText };
    }
    const data = (await response.json()) as UserProfile;

    return { success: true, data };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
};

export async function getUserProfileByEmail(userEmail: string): Promise<APIResult<UserProfile>> {
  try {
    const response = await get(`/users/email/${userEmail}`);
    if (!response.ok) {
      return handleAPIError(response);
    }
    const data = (await response.json()) as UserProfile;
    return { success: true, data };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
}

export async function checkIfUserEmailExists(userEmail: string): Promise<APIResult<boolean>> {
  try {
    const response = await get(`/users/${userEmail}`);
    if (!response.ok) {
      return handleAPIError(response);
    }
    const json = (await response.json()) as unknown as { exists: boolean };
    return { success: true, data: json.exists };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
}

export async function getComments(profileId: string): Promise<APIResult<ProfileComment[]>> {
  try {
    const response = await get(`/comments/${profileId}`);
    if (!response.ok) {
      return handleAPIError(response);
    }
    const data = (await response.json()) as ProfileCommentRequest[];
    return { success: true, data: parseProfileComment(data) };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
}

export async function postComment(
  comment: ProfileCommentPostRequest,
): Promise<APIResult<ProfileCommentPostRequest>> {
  try {
    const response = await post("/comments", comment);
    if (!response.ok) {
      return handleAPIError(response);
    }
    const data = (await response.json()) as ProfileCommentPostRequest;
    return { success: true, data };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
}
