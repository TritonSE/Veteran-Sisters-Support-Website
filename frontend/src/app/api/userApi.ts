// users.ts
import { APIResult, handleAPIError, post } from "./requests"; // Update path as needed

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

export async function createUser(
  userData: CreateUserRequest,
): Promise<APIResult<CreateUserRequest>> {
  try {
    const response = await post("/users", userData);
    const data = (await response.json()) as CreateUserRequest;
    console.log("Data: ", data);
    return { success: true, data };
  } catch (error: unknown) {
    return handleAPIError(error);
  }
}

export default createUser;
