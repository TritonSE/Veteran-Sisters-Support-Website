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

export type APIResult<T> = { success: true; data: T } | { success: false; error: string };

export const createUser = async (
  fileObject: CreateUserRequest,
): Promise<APIResult<CreateUserRequest>> => {
  try {
    const response = await fetch("http://localhost:4000/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fileObject),
    });
    console.log("Response received:", response);
    if (!response.ok) {
      return { success: false, error: response.statusText };
    }
    const data = (await response.json()) as CreateUserRequest;
    console.log("Data: ", data);
    return { success: true, data };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
};

export default createUser;
